import { getPredictionConfig, type PredictionConfig } from "../config/predictionConfigs.js";
import { GROUPS } from "../data/groups.js";
import { GROUP_FIXTURES } from "../data/fixtures.js";
import { getTeamById } from "../data/teams.js";
import { predictMatch } from "./matchPredictor.js";
import { scoreFromPrediction } from "./scoreFromPrediction.js";
import type { TournamentPrediction } from "../types/prediction.js";

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export function simulateGroupStandings(configId?: string): Record<string, GroupStanding[]> {
  const config = getPredictionConfig(configId);
  const standings: Record<string, GroupStanding[]> = {};

  for (const group of GROUPS) {
    standings[group.group] = group.teamIds.map((id) => ({
      teamId: id, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
    }));
  }

  for (const fixture of GROUP_FIXTURES) {
    const pred = predictMatch({ fixture, config });
    const group = fixture.group!;
    const table = standings[group];
    if (!table) continue;
    const home = table.find((s) => s.teamId === fixture.homeTeamId);
    const away = table.find((s) => s.teamId === fixture.awayTeamId);
    if (!home || !away) continue;
    const { homeGoals: hGoals, awayGoals: aGoals } = scoreFromPrediction(pred);

    home.played++; away.played++;
    home.goalsFor += hGoals; home.goalsAgainst += aGoals;
    away.goalsFor += aGoals; away.goalsAgainst += hGoals;

    if (hGoals > aGoals) { home.won++; home.points += 3; away.lost++; }
    else if (hGoals < aGoals) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; away.drawn++; home.points++; away.points++; }
  }

  for (const g of Object.keys(standings)) {
    standings[g].sort(
      (a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
    );
  }

  return standings;
}

// ── Monte Carlo Tournament Simulation ───────────────────────────────────────
// Runs N simulations of the knockout bracket to produce robust win probabilities
// rather than deterministically picking the highest-Elo winner every time.

const MC_RUNS = 10_000;

/**
 * Simulate a single knockout match between two teams.
 * Returns the winner's teamId using Elo-based probabilities with a draw/ET resolution.
 */
function simulateKnockoutMatch(teamA: string, teamB: string): string {
  const a = getTeamById(teamA);
  const b = getTeamById(teamB);
  if (!a || !b) return teamA;

  const eloA = a.eloRating;
  const eloB = b.eloRating;
  const winProbA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const rand = Math.random();

  // In knockouts there are no draws — if within draw band, coin-flip (ET/pens)
  const drawBand = 0.08;
  if (rand < winProbA - drawBand / 2) return teamA;
  if (rand > winProbA + drawBand / 2) return teamB;
  // Extra time / penalties — slight edge to higher Elo
  return Math.random() < 0.5 + (eloA - eloB) / 4000 ? teamA : teamB;
}

/**
 * Simulate the full knockout bracket from group winners.
 * WC2026 format: 12 groups → Round of 32 → R16 → QF → SF → Final.
 */
function simulateKnockout(groupWinners: string[], runnersUp: string[]): string {
  // Build Round of 32: winners vs runners-up cross-bracket
  let remaining = [...groupWinners, ...runnersUp];

  // Shuffle slightly to mix bracket (simplified – real bracket has fixed cross paths)
  while (remaining.length > 1) {
    const nextRound: string[] = [];
    for (let i = 0; i < remaining.length; i += 2) {
      const winner = simulateKnockoutMatch(remaining[i], remaining[i + 1] ?? remaining[i]);
      nextRound.push(winner);
    }
    remaining = nextRound;
  }

  return remaining[0];
}

export function predictTournament(configId?: string): TournamentPrediction {
  const config = getPredictionConfig(configId);
  const standings = simulateGroupStandings(config.id);

  const groupWinners: Record<string, string> = {};
  const groupRunnersUp: string[] = [];

  for (const [group, table] of Object.entries(standings)) {
    groupWinners[group] = table[0].teamId;
    if (table[1]) groupRunnersUp.push(table[1].teamId);
  }

  const winners = Object.values(groupWinners);

  // ── Monte Carlo: run MC_RUNS simulations ────────────────────────────────
  const winCounts: Record<string, number> = {};
  const sfCounts: Record<string, number> = {};

  for (let run = 0; run < MC_RUNS; run++) {
    // Shuffle to simulate different bracket paths
    const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
    const shuffledRunners = [...groupRunnersUp].sort(() => Math.random() - 0.5);
    const allTeams = [...shuffledWinners, ...shuffledRunners].slice(0, 32);

    // Track semifinalists (last 4 teams)
    let round = [...allTeams];
    let sfRound: string[] = [];

    while (round.length > 1) {
      const nextRound: string[] = [];
      for (let i = 0; i < round.length; i += 2) {
        const w = simulateKnockoutMatch(round[i], round[i + 1] ?? round[i]);
        nextRound.push(w);
      }
      if (round.length === 8) sfRound = [...nextRound]; // QF winners = SF participants
      round = nextRound;
    }

    const champion = round[0];
    winCounts[champion] = (winCounts[champion] ?? 0) + 1;
    for (const sf of sfRound) {
      sfCounts[sf] = (sfCounts[sf] ?? 0) + 1;
    }
  }

  // Sort by win count to find champion and top semifinalists
  const sortedByWins = Object.entries(winCounts)
    .sort(([, a], [, b]) => b - a);

  const championId = sortedByWins[0]?.[0] ?? winners[0];
  const championProb = Math.round(((winCounts[championId] ?? 0) / MC_RUNS) * 1000) / 1000;

  const semifinalists = Object.entries(sfCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([id]) => id);

  const championTeam = getTeamById(championId);

  return {
    championId,
    championProb,
    semifinalists,
    topScorer: championTeam?.code === "FRA" ? "mbappe"
             : championTeam?.code === "ARG" ? "messi"
             : championTeam?.code === "ESP" ? "yamal"
             : "unknown",
    groupWinners,
    configId: config.id,
  };
}

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
    const home = table.find((s) => s.teamId === fixture.homeTeamId)!;
    const away = table.find((s) => s.teamId === fixture.awayTeamId)!;
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

function pickBestByElo(teamIds: string[]): string {
  return teamIds.reduce((best, id) => {
    const bestTeam = getTeamById(best)!;
    const candidate = getTeamById(id)!;
    return candidate.eloRating > bestTeam.eloRating ? id : best;
  });
}

export function predictTournament(configId?: string): TournamentPrediction {
  const config = getPredictionConfig(configId);
  const standings = simulateGroupStandings(config.id);
  const groupWinners: Record<string, string> = {};

  for (const [group, table] of Object.entries(standings)) {
    groupWinners[group] = table[0].teamId;
  }

  const winners = Object.values(groupWinners);
  const championId = pickBestByElo(winners);
  const championTeam = getTeamById(championId)!;
  const semifinalists = [...winners]
    .sort((a, b) => (getTeamById(b)?.eloRating ?? 0) - (getTeamById(a)?.eloRating ?? 0))
    .slice(0, 4);

  const avgElo = winners.reduce((s, id) => s + (getTeamById(id)?.eloRating ?? 0), 0) / winners.length;
  const championProb = Math.min(0.35, Math.max(0.08, (championTeam.eloRating - avgElo) / 1000 + 0.12));

  return {
    championId,
    championProb: Math.round(championProb * 1000) / 1000,
    semifinalists,
    topScorer: championTeam.code === "FRA" ? "mbappe" : "unknown",
    groupWinners,
    configId: config.id,
  };
}

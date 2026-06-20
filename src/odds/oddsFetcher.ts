import type { MarketOdds, NormalizedOdds } from "./oddsTypes.js";
import { americanToDecimal } from "../utils/kellyCriterion.js";
import { impliedProbability } from "../utils/expectedValue.js";
import { loadEnv } from "../config/env.js";
import { GROUP_FIXTURES } from "../data/fixtures.js";
import { TEAMS } from "../data/teams.js";

// Helper to find a fixture by matching team names from the API
function findFixtureId(apiHomeName: string, apiAwayName: string): string | null {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const h = normalize(apiHomeName);
  const a = normalize(apiAwayName);

  for (const f of GROUP_FIXTURES) {
    const homeTeam = TEAMS.find(t => t.id === f.homeTeamId);
    const awayTeam = TEAMS.find(t => t.id === f.awayTeamId);
    if (!homeTeam || !awayTeam) continue;

    const fH = normalize(homeTeam.name);
    const fA = normalize(awayTeam.name);
    const fHCode = normalize(homeTeam.code);
    const fACode = normalize(awayTeam.code);

    // API team names might be flipped compared to our fixture list
    const matchForward = (h.includes(fH) || fH.includes(h) || h === fHCode) && (a.includes(fA) || fA.includes(a) || a === fACode);
    const matchReverse = (a.includes(fH) || fH.includes(a) || a === fHCode) && (h.includes(fA) || fA.includes(h) || h === fACode);

    if (matchForward || matchReverse) return f.id;
  }
  return null;
}

export async function fetchOdds(matchId?: string): Promise<MarketOdds[]> {
  loadEnv();
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    console.warn("No ODDS_API_KEY set. Returning empty odds.");
    return [];
  }

  const url = `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds/?apiKey=${apiKey}&regions=us,eu&markets=h2h&oddsFormat=american`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch odds:", await response.text());
    return [];
  }

  const data = (await response.json()) as any[];
  const results: MarketOdds[] = [];

  for (const match of data) {
    if (!match.bookmakers || match.bookmakers.length === 0) continue;
    
    const fixtureId = findFixtureId(match.home_team, match.away_team);
    if (!fixtureId) continue;
    if (matchId && fixtureId !== matchId) continue;

    // Prefer pinnacle if available, otherwise take the first bookmaker
    let bookie = match.bookmakers.find((b: any) => b.key === "pinnacle") || match.bookmakers[0];
    const market = bookie.markets.find((m: any) => m.key === "h2h");
    if (!market || !market.outcomes) continue;

    let homeAmerican = 0;
    let awayAmerican = 0;
    let drawAmerican = 0;

    for (const outcome of market.outcomes) {
      if (outcome.name === "Draw") {
        drawAmerican = outcome.price;
      } else if (outcome.name === match.home_team) {
        homeAmerican = outcome.price;
      } else if (outcome.name === match.away_team) {
        awayAmerican = outcome.price;
      }
    }

    results.push({
      matchId: fixtureId,
      homeAmerican,
      drawAmerican,
      awayAmerican,
      source: bookie.key,
      fetchedAt: new Date().toISOString(),
    });
  }

  return results;
}

export function normalizeOdds(odds: MarketOdds): NormalizedOdds {
  const homeDecimal = americanToDecimal(odds.homeAmerican);
  const drawDecimal = americanToDecimal(odds.drawAmerican);
  const awayDecimal = americanToDecimal(odds.awayAmerican);
  return {
    matchId: odds.matchId,
    homeDecimal, drawDecimal, awayDecimal,
    homeImplied: impliedProbability(homeDecimal),
    drawImplied: impliedProbability(drawDecimal),
    awayImplied: impliedProbability(awayDecimal),
  };
}

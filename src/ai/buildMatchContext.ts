import { getFormForTeam } from "../data/formHistory.js";
import { getVenueById } from "../data/venues.js";
import { getTeamById } from "../data/teams.js";
import type { MatchFixture } from "../types/match.js";
import type { MatchPrediction } from "../types/prediction.js";
import type { MatchAiContext } from "./types.js";

function summarizeForm(teamId: string): string {
  const results = getFormForTeam(teamId);
  if (results.length === 0) return "no recent data";
  const wins = results.filter((r) => r.goalsFor > r.goalsAgainst).length;
  const draws = results.filter((r) => r.goalsFor === r.goalsAgainst).length;
  const losses = results.length - wins - draws;
  return `${wins}W-${draws}D-${losses}L in last ${results.length}`;
}

export function buildMatchAiContext(
  fixture: MatchFixture,
  statistical: MatchPrediction
): MatchAiContext {
  const home = getTeamById(fixture.homeTeamId)!;
  const away = getTeamById(fixture.awayTeamId)!;
  const venue = getVenueById(fixture.venueId);

  return {
    fixture,
    home,
    away,
    statistical,
    venueName: venue?.name,
    homeFormSummary: summarizeForm(home.id),
    awayFormSummary: summarizeForm(away.id),
  };
}

export function buildAiPrompt(context: MatchAiContext): string {
  const { home, away, statistical, venueName, homeFormSummary, awayFormSummary, fixture } = context;
  return [
    `FIFA World Cup 2026 match analysis: ${home.name} vs ${away.name}`,
    `Stage: ${fixture.stage}${fixture.group ? ` (Group ${fixture.group})` : ""}`,
    `Venue: ${venueName ?? "TBD"}`,
    `${home.code}: FIFA rank #${home.fifaRank}, Elo ${home.eloRating}${home.isHost ? ", HOST NATION" : ""}, form ${homeFormSummary}`,
    `${away.code}: FIFA rank #${away.fifaRank}, Elo ${away.eloRating}${away.isHost ? ", HOST NATION" : ""}, form ${awayFormSummary}`,
    `Statistical model baseline: home ${(statistical.homeWinProb * 100).toFixed(1)}%, draw ${(statistical.drawProb * 100).toFixed(1)}%, away ${(statistical.awayWinProb * 100).toFixed(1)}%`,
    `Expected goals baseline: ${statistical.expectedHomeGoals} - ${statistical.expectedAwayGoals}`,
    "",
    "Provide your independent prediction as JSON with keys:",
    "homeWinProb, drawProb, awayWinProb, expectedHomeGoals, expectedAwayGoals, reasoning",
    "Probabilities must sum to 1. Reasoning should be 1-2 sentences on tactics, form, and context.",
  ].join("\n");
}

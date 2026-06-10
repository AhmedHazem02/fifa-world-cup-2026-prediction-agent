import type { ClubMatchContext, ClubStatisticalPrediction } from "../types/club.js";

export interface ClubAiContext {
  match: ClubMatchContext;
  statistical: ClubStatisticalPrediction;
}

function formatRecord(label: string, record: ClubMatchContext["homeRecord"]): string {
  if (record.played === 0) return `${label}: no historical matches in dataset`;
  return `${label}: ${record.played} matches, ${record.wins}W-${record.draws}D-${record.losses}L, goals ${record.goalsFor}-${record.goalsAgainst}`;
}

export function buildClubAiContext(
  match: ClubMatchContext,
  statistical: ClubStatisticalPrediction,
): ClubAiContext {
  return { match, statistical };
}

export function buildClubAiPrompt(context: ClubAiContext): string {
  const { match, statistical } = context;
  const sparseData =
    !match.resolvedHome ||
    !match.resolvedAway ||
    match.homeRecord.played + match.awayRecord.played < 4;

  return [
    `Club soccer match analysis: ${match.homeTeam} (home) vs ${match.awayTeam} (away)`,
    `Resolved names in dataset: home=${match.resolvedHome ?? "unknown"}, away=${match.resolvedAway ?? "unknown"}`,
    formatRecord("Home team record", match.homeRecord),
    formatRecord("Away team record", match.awayRecord),
    match.headToHead.played > 0
      ? `Head-to-head: ${match.headToHead.played} matches, ${match.headToHead.homeWins} home wins, ${match.headToHead.draws} draws, ${match.headToHead.awayWins} away wins`
      : "Head-to-head: no matches in dataset",
    `League draw rate in dataset: ${(match.leagueDrawRate * 100).toFixed(1)}%`,
    `Statistical baseline: home ${(statistical.homeWinProb * 100).toFixed(1)}%, draw ${(statistical.drawProb * 100).toFixed(1)}%, away ${(statistical.awayWinProb * 100).toFixed(1)}% (confidence ${(statistical.confidence * 100).toFixed(0)}%)`,
    sparseData
      ? "Historical data is sparse. Combine the baseline with your knowledge of team strength and home advantage. Lower confidence when data is thin."
      : "Use the historical signals as primary evidence. Adjust only when there is a clear reason.",
    "",
    "Provide your independent prediction as JSON with keys:",
    "homeWinProb, drawProb, awayWinProb, reasoning",
    "Probabilities must sum to 1. Reasoning should be 1-2 sentences.",
  ].join("\n");
}

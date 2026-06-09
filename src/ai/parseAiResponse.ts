import type { AiMatchPrediction } from "./types.js";

interface RawAiJson {
  homeWinProb?: number;
  drawProb?: number;
  awayWinProb?: number;
  expectedHomeGoals?: number;
  expectedAwayGoals?: number;
  reasoning?: string;
}

function normalizeProbs(home: number, draw: number, away: number): {
  home: number;
  draw: number;
  away: number;
} {
  const sum = home + draw + away;
  if (sum <= 0) return { home: 0.33, draw: 0.34, away: 0.33 };
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

export function parseAiResponse(
  content: string,
  provider: string,
  model: string
): AiMatchPrediction {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain JSON");
  }

  const raw = JSON.parse(jsonMatch[0]) as RawAiJson;
  const probs = normalizeProbs(
    Number(raw.homeWinProb ?? 0.33),
    Number(raw.drawProb ?? 0.34),
    Number(raw.awayWinProb ?? 0.33)
  );

  return {
    homeWinProb: Math.round(probs.home * 1000) / 1000,
    drawProb: Math.round(probs.draw * 1000) / 1000,
    awayWinProb: Math.round(probs.away * 1000) / 1000,
    expectedHomeGoals: raw.expectedHomeGoals != null ? Number(raw.expectedHomeGoals) : undefined,
    expectedAwayGoals: raw.expectedAwayGoals != null ? Number(raw.expectedAwayGoals) : undefined,
    reasoning: String(raw.reasoning ?? "No reasoning provided"),
    provider,
    model,
  };
}

import { calculateConfidence, modelAgreement } from "./confidence.js";
import type { MatchPrediction } from "../types/prediction.js";
import type { AiMatchPrediction, HybridMatchPrediction } from "../ai/types.js";

function normalize(home: number, draw: number, away: number) {
  const sum = home + draw + away || 1;
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

export function combineStatisticalAndAi(
  statistical: MatchPrediction,
  ai: AiMatchPrediction,
  aiWeight: number
): HybridMatchPrediction {
  const statWeight = 1 - aiWeight;
  const blended = normalize(
    statWeight * statistical.homeWinProb + aiWeight * ai.homeWinProb,
    statWeight * statistical.drawProb + aiWeight * ai.drawProb,
    statWeight * statistical.awayWinProb + aiWeight * ai.awayWinProb
  );

  const expectedHomeGoals =
    Math.round(
      (statWeight * statistical.expectedHomeGoals +
        aiWeight * (ai.expectedHomeGoals ?? statistical.expectedHomeGoals)) *
        100
    ) / 100;

  const expectedAwayGoals =
    Math.round(
      (statWeight * statistical.expectedAwayGoals +
        aiWeight * (ai.expectedAwayGoals ?? statistical.expectedAwayGoals)) *
        100
    ) / 100;

  const agreement = modelAgreement([
    [statistical.homeWinProb, statistical.drawProb, statistical.awayWinProb],
    [ai.homeWinProb, ai.drawProb, ai.awayWinProb],
    [blended.home, blended.draw, blended.away],
  ]);

  return {
    matchId: statistical.matchId,
    homeWinProb: Math.round(blended.home * 1000) / 1000,
    drawProb: Math.round(blended.draw * 1000) / 1000,
    awayWinProb: Math.round(blended.away * 1000) / 1000,
    expectedHomeGoals,
    expectedAwayGoals,
    confidence: calculateConfidence(agreement, ai.provider === "mock" ? 0.7 : 0.85, 8),
    model: `hybrid-${statistical.configId}`,
    configId: statistical.configId,
    statistical,
    ai,
    aiWeight,
    hybrid: true,
  };
}

import { loadEnv } from "../config/env.js";
import { getAiConfig } from "../config/aiConfig.js";
import { buildClubAiContext } from "../ai/buildClubContext.js";
import { getClubAiProvider } from "../ai/clubAiProvider.js";
import {
  buildClubMatchContext,
  loadClubHistory,
  trainingTable,
} from "../data/clubHistory.js";
import { modelAgreement, calculateConfidence } from "./confidence.js";
import { predictClubStatistical } from "./clubStatistical.js";
import type { ClubMatchPrediction } from "../types/club.js";

export interface PredictClubsOptions {
  useAi?: boolean;
  aiWeight?: number;
  forceMockAi?: boolean;
  useCache?: boolean;
}

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function pickOutcome(
  homeWinProb: number,
  drawProb: number,
  awayWinProb: number,
): "home" | "draw" | "away" {
  const max = Math.max(homeWinProb, drawProb, awayWinProb);
  if (max === homeWinProb) return "home";
  if (max === drawProb) return "draw";
  return "away";
}

function blendRates(
  statistical: { homeWinProb: number; drawProb: number; awayWinProb: number },
  ai: { homeWinProb: number; drawProb: number; awayWinProb: number },
  aiWeight: number,
) {
  const statWeight = 1 - aiWeight;
  const home = statWeight * statistical.homeWinProb + aiWeight * ai.homeWinProb;
  const draw = statWeight * statistical.drawProb + aiWeight * ai.drawProb;
  const away = statWeight * statistical.awayWinProb + aiWeight * ai.awayWinProb;
  const sum = home + draw + away || 1;
  return {
    homeWinProb: roundRate(home / sum),
    drawProb: roundRate(draw / sum),
    awayWinProb: roundRate(away / sum),
  };
}

/**
 * Predict a club fixture from two team names using remote CSV history + optional AI hybrid.
 */
export async function predictClubs(
  homeTeam: string,
  awayTeam: string,
  options: PredictClubsOptions = {},
): Promise<ClubMatchPrediction> {
  if (!homeTeam?.trim() || !awayTeam?.trim()) {
    throw new Error("predictClubs requires both home and away team names.");
  }

  loadEnv();
  const history = await loadClubHistory(options.useCache !== false);
  const context = buildClubMatchContext(homeTeam.trim(), awayTeam.trim(), trainingTable(history));
  const statistical = predictClubStatistical(context);

  const wantsAi = options.useAi !== false;
  if (!wantsAi) {
    const outcome = pickOutcome(
      statistical.homeWinProb,
      statistical.drawProb,
      statistical.awayWinProb,
    );
    return {
      homeTeam: context.homeTeam,
      awayTeam: context.awayTeam,
      homeWinProb: roundRate(statistical.homeWinProb),
      drawProb: roundRate(statistical.drawProb),
      awayWinProb: roundRate(statistical.awayWinProb),
      outcome,
      confidence: roundRate(statistical.confidence),
      reasoning: `Statistical model from ${context.homeRecord.played + context.awayRecord.played} team matches in dataset.`,
      model: "statistical-club",
      resolvedHome: context.resolvedHome,
      resolvedAway: context.resolvedAway,
      context: {
        homeMatches: context.homeRecord.played,
        awayMatches: context.awayRecord.played,
        headToHeadMatches: context.headToHead.played,
        leagueDrawRate: roundRate(context.leagueDrawRate),
      },
      statistical,
      hybrid: false,
    };
  }

  const aiWeight = options.aiWeight ?? getAiConfig().defaultBlendWeight;
  const provider = getClubAiProvider(options.forceMockAi);
  const aiContext = buildClubAiContext(context, statistical);
  const ai = await provider.predictClub(aiContext);
  const blended = blendRates(statistical, ai, aiWeight);

  const agreement = modelAgreement([
    [statistical.homeWinProb, statistical.drawProb, statistical.awayWinProb],
    [ai.homeWinProb, ai.drawProb, ai.awayWinProb],
    [blended.homeWinProb, blended.drawProb, blended.awayWinProb],
  ]);
  const sampleSize = context.homeRecord.played + context.awayRecord.played + context.headToHead.played;
  const confidence = calculateConfidence(
    agreement,
    provider.name === "mock" ? 0.7 : 0.85,
    sampleSize,
  );

  const outcome = pickOutcome(blended.homeWinProb, blended.drawProb, blended.awayWinProb);

  return {
    homeTeam: context.homeTeam,
    awayTeam: context.awayTeam,
    homeWinProb: blended.homeWinProb,
    drawProb: blended.drawProb,
    awayWinProb: blended.awayWinProb,
    outcome,
    confidence: roundRate(confidence),
    reasoning: ai.reasoning,
    model: `hybrid-club (${provider.name})`,
    resolvedHome: context.resolvedHome,
    resolvedAway: context.resolvedAway,
    context: {
      homeMatches: context.homeRecord.played,
      awayMatches: context.awayRecord.played,
      headToHeadMatches: context.headToHead.played,
      leagueDrawRate: roundRate(context.leagueDrawRate),
    },
    statistical,
    ai: {
      homeWinProb: ai.homeWinProb,
      drawProb: ai.drawProb,
      awayWinProb: ai.awayWinProb,
      reasoning: ai.reasoning,
      provider: ai.provider,
      model: ai.model,
    },
    aiWeight,
    hybrid: true,
  };
}

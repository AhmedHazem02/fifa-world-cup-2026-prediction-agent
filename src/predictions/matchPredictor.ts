import { getPredictionConfig, type PredictionConfig } from "../config/predictionConfigs.js";
import { getTeamById } from "../data/teams.js";
import { getFormForTeam } from "../data/formHistory.js";
import { getVenueById } from "../data/venues.js";
import { winDrawLossProbs } from "../models/elo.js";
import { expectedGoals, outcomeProbsFromMatrix, scoreMatrix } from "../models/poisson.js";
import { attackDefenseFromForm, calculateFormScore, type RecentResult } from "../models/formScore.js";
import { hostAdvantageBonus } from "../models/hostAdvantage.js";
import { venuePerformanceModifier } from "../models/altitudeImpact.js";
import { ensemblePredict } from "../models/ensemble.js";
import { calculateConfidence, modelAgreement } from "./confidence.js";
import { cacheGet, cacheSet } from "../utils/cache.js";
import type { MatchFixture } from "../types/match.js";
import type { MatchPrediction } from "../types/prediction.js";

export interface PredictorInput {
  fixture: MatchFixture;
  homeForm?: RecentResult[];
  awayForm?: RecentResult[];
  config?: PredictionConfig;
  configId?: string;
}

function normalizeProbs(home: number, draw: number, away: number): { home: number; draw: number; away: number } {
  const sum = home + draw + away;
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

function applyDrawBias(
  probs: { home: number; draw: number; away: number },
  drawBias: number
): { home: number; draw: number; away: number } {
  if (drawBias === 1) return probs;
  const draw = probs.draw * drawBias;
  const remaining = 1 - draw;
  const nonDrawSum = probs.home + probs.away || 1;
  return normalizeProbs(
    probs.home / nonDrawSum * remaining,
    draw,
    probs.away / nonDrawSum * remaining
  );
}

export function predictMatch(input: PredictorInput): MatchPrediction {
  const config = input.config ?? getPredictionConfig(input.configId);

  const home = getTeamById(input.fixture.homeTeamId);
  const away = getTeamById(input.fixture.awayTeamId);
  if (!home || !away) throw new Error(`Unknown team in fixture ${input.fixture.id}`);

  const cacheKey = `pred:${config.id}:${input.fixture.id}`;
  const cached = cacheGet<MatchPrediction>(cacheKey);
  if (cached) return cached;

  const homeForm = input.homeForm ?? getFormForTeam(home.id);
  const awayForm = input.awayForm ?? getFormForTeam(away.id);
  const venue = getVenueById(input.fixture.venueId);

  let homeAdvantage = home.isHost ? config.hostHomeAdvantage : config.homeAdvantage;
  if (config.useHostVenueBonus && venue) {
    homeAdvantage += hostAdvantageBonus(home.code, venue.country);
  }

  const elo = winDrawLossProbs(home.eloRating, away.eloRating, homeAdvantage);

  const homeAD = attackDefenseFromForm(homeForm);
  const awayAD = attackDefenseFromForm(awayForm);
  let homeLambda = expectedGoals(homeAD.attack, awayAD.defense);
  let awayLambda = expectedGoals(awayAD.attack, homeAD.defense);

  if (config.useAltitudeFactor && venue) {
    const homeMod = venuePerformanceModifier(venue.id, home.isHost ?? false);
    const awayMod = venuePerformanceModifier(venue.id, away.isHost ?? false);
    homeLambda *= homeMod;
    awayLambda *= awayMod;
  }

  const matrix = scoreMatrix(homeLambda, awayLambda);
  const poissonOutcomes = outcomeProbsFromMatrix(matrix);
  const poisson = {
    ...poissonOutcomes,
    expectedHomeGoals: homeLambda,
    expectedAwayGoals: awayLambda,
  };

  const homeFormScore = calculateFormScore(homeForm);
  const awayFormScore = calculateFormScore(awayForm);
  const formTotal = homeFormScore + awayFormScore || 1;
  const formRaw = {
    home: (homeFormScore / formTotal) * 0.8,
    away: (awayFormScore / formTotal) * 0.8,
    draw: 0.2,
  };
  const form = normalizeProbs(formRaw.home, formRaw.draw, formRaw.away);

  const ensembleRaw = ensemblePredict({ elo, poisson, form }, config.weights);
  const ensemble = applyDrawBias(
    normalizeProbs(ensembleRaw.home, ensembleRaw.draw, ensembleRaw.away),
    config.drawBias
  );

  const agreement = modelAgreement([
    [elo.home, elo.draw, elo.away],
    [poisson.home, poisson.draw, poisson.away],
    [form.home, form.draw, form.away],
  ]);

  const prediction: MatchPrediction = {
    matchId: input.fixture.id,
    homeWinProb: Math.round(ensemble.home * 1000) / 1000,
    drawProb: Math.round(ensemble.draw * 1000) / 1000,
    awayWinProb: Math.round(ensemble.away * 1000) / 1000,
    expectedHomeGoals: Math.round((ensembleRaw.expectedHomeGoals ?? homeLambda) * 100) / 100,
    expectedAwayGoals: Math.round((ensembleRaw.expectedAwayGoals ?? awayLambda) * 100) / 100,
    confidence: calculateConfidence(agreement, 0.8, homeForm.length + awayForm.length),
    model: `ensemble-${config.id}`,
    configId: config.id,
  };

  cacheSet(cacheKey, prediction);
  return prediction;
}

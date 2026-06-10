import type { ClubMatchContext, ClubStatisticalPrediction } from "../types/club.js";
import type { ClubTeamRecord } from "../types/club.js";

const PRIOR = { homeWin: 0.42, draw: 0.26, awayWin: 0.32 };
const FLOOR = 0.08;

function teamRates(record: ClubTeamRecord): { win: number; draw: number; loss: number } {
  if (record.played === 0) return { win: 1 / 3, draw: 1 / 3, loss: 1 / 3 };
  return {
    win: record.wins / record.played,
    draw: record.draws / record.played,
    loss: record.losses / record.played,
  };
}

function sampleConfidence(context: ClubMatchContext): number {
  const samples =
    context.homeRecord.played +
    context.awayRecord.played +
    context.headToHead.played * 2;
  const knownTeams = Number(Boolean(context.resolvedHome)) + Number(Boolean(context.resolvedAway));
  const coverage = knownTeams / 2;
  return Math.min(0.95, Math.max(0.15, (samples / 16) * coverage));
}

function normalizeRates(rates: ClubStatisticalPrediction): ClubStatisticalPrediction {
  const homeWin = Math.max(FLOOR, rates.homeWinProb);
  const draw = Math.max(FLOOR, rates.drawProb);
  const awayWin = Math.max(FLOOR, rates.awayWinProb);
  const sum = homeWin + draw + awayWin;
  return {
    homeWinProb: homeWin / sum,
    drawProb: draw / sum,
    awayWinProb: awayWin / sum,
    confidence: rates.confidence,
  };
}

/** Baseline club win/draw rates from historical records (no LLM). */
export function predictClubStatistical(context: ClubMatchContext): ClubStatisticalPrediction {
  const home = teamRates(context.homeRecord);
  const away = teamRates(context.awayRecord);

  let homeWin = home.win * 0.45 + away.loss * 0.35;
  let draw = (home.draw + away.draw) / 2 * 0.5 + context.leagueDrawRate * 0.5;
  let awayWin = away.win * 0.45 + home.loss * 0.35;

  const priorWeight = Math.max(0.25, 1 - sampleConfidence(context));
  homeWin = homeWin * (1 - priorWeight) + PRIOR.homeWin * priorWeight;
  draw = draw * (1 - priorWeight) + PRIOR.draw * priorWeight;
  awayWin = awayWin * (1 - priorWeight) + PRIOR.awayWin * priorWeight;

  if (context.headToHead.played > 0) {
    const h2hWeight = Math.min(0.35, context.headToHead.played / 12);
    homeWin =
      homeWin * (1 - h2hWeight) +
      (context.headToHead.homeWins / context.headToHead.played) * h2hWeight;
    draw =
      draw * (1 - h2hWeight) +
      (context.headToHead.draws / context.headToHead.played) * h2hWeight;
    awayWin =
      awayWin * (1 - h2hWeight) +
      (context.headToHead.awayWins / context.headToHead.played) * h2hWeight;
  }

  return normalizeRates({
    homeWinProb: homeWin,
    drawProb: draw,
    awayWinProb: awayWin,
    confidence: sampleConfidence(context),
  });
}

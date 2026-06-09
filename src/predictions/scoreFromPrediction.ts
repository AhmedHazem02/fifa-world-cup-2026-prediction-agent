import type { MatchPrediction } from "../types/prediction.js";

export interface SimulatedScore {
  homeGoals: number;
  awayGoals: number;
}

/** Derive a realistic scoreline from probabilities instead of naive goal rounding. */
export function scoreFromPrediction(pred: MatchPrediction): SimulatedScore {
  const { homeWinProb, drawProb, awayWinProb, expectedHomeGoals, expectedAwayGoals } = pred;
  const maxProb = Math.max(homeWinProb, drawProb, awayWinProb);

  if (maxProb === drawProb) {
    const goals = Math.max(0, Math.round((expectedHomeGoals + expectedAwayGoals) / 2));
    return { homeGoals: goals, awayGoals: goals };
  }

  if (maxProb === homeWinProb) {
    const homeGoals = Math.max(1, Math.ceil(expectedHomeGoals));
    const awayGoals = Math.min(Math.floor(expectedAwayGoals), homeGoals - 1);
    return { homeGoals, awayGoals: Math.max(0, awayGoals) };
  }

  const awayGoals = Math.max(1, Math.ceil(expectedAwayGoals));
  const homeGoals = Math.min(Math.floor(expectedHomeGoals), awayGoals - 1);
  return { homeGoals: Math.max(0, homeGoals), awayGoals };
}

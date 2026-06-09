import { winDrawLossProbs } from "../models/elo.js";
import type { AiProvider, AiMatchPrediction, MatchAiContext } from "./types.js";

/** Offline AI provider — heuristic analysis without an API key. */
export class MockAiProvider implements AiProvider {
  readonly name = "mock";
  readonly model = "mock-analyst-v1";

  async predictMatch(context: MatchAiContext): Promise<AiMatchPrediction> {
    const { home, away, statistical } = context;
    const elo = winDrawLossProbs(
      home.eloRating,
      away.eloRating,
      home.isHost ? 95 : 70
    );

    // AI layer adds qualitative adjustments the stats model may miss
    let homeAdj = 0;
    let awayAdj = 0;
    let drawAdj = 0;

    if (home.isHost) homeAdj += 0.04;
    if (away.isHost) awayAdj += 0.04;
    if (home.fifaRank < away.fifaRank) homeAdj += 0.03;
    else if (away.fifaRank < home.fifaRank) awayAdj += 0.03;

    const confederationDerby =
      home.confederation === away.confederation && home.confederation !== "UEFA";
    if (confederationDerby) drawAdj += 0.05;

    const blended = {
      home: elo.home * 0.4 + statistical.homeWinProb * 0.4 + homeAdj,
      draw: elo.draw * 0.3 + statistical.drawProb * 0.3 + drawAdj,
      away: elo.away * 0.4 + statistical.awayWinProb * 0.4 + awayAdj,
    };
    const sum = blended.home + blended.draw + blended.away;

    const reasons: string[] = [];
    if (home.isHost) reasons.push(`${home.code} host advantage`);
    if (away.isHost) reasons.push(`${away.code} host advantage`);
    if (home.fifaRank < away.fifaRank) reasons.push(`${home.code} higher ranked`);
    else if (away.fifaRank < home.fifaRank) reasons.push(`${away.code} higher ranked`);
    if (confederationDerby) reasons.push("regional derby tends toward tight games");

    return {
      homeWinProb: Math.round((blended.home / sum) * 1000) / 1000,
      drawProb: Math.round((blended.draw / sum) * 1000) / 1000,
      awayWinProb: Math.round((blended.away / sum) * 1000) / 1000,
      expectedHomeGoals: statistical.expectedHomeGoals,
      expectedAwayGoals: statistical.expectedAwayGoals,
      reasoning: reasons.length > 0
        ? `Mock AI analysis: ${reasons.join("; ")}.`
        : "Mock AI analysis: even contest with slight statistical lean.",
      provider: this.name,
      model: this.model,
    };
  }
}

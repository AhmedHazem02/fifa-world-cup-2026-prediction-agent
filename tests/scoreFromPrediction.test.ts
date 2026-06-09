import { describe, it, expect } from "vitest";
import { scoreFromPrediction } from "../src/predictions/scoreFromPrediction.js";
import type { MatchPrediction } from "../src/types/prediction.js";

function makePred(overrides: Partial<MatchPrediction>): MatchPrediction {
  return {
    matchId: "A1",
    homeWinProb: 0.5,
    drawProb: 0.25,
    awayWinProb: 0.25,
    expectedHomeGoals: 1.5,
    expectedAwayGoals: 1.2,
    confidence: 0.7,
    model: "test",
    configId: "balanced",
    ...overrides,
  };
}

describe("scoreFromPrediction", () => {
  it("assigns home win when home prob is highest", () => {
    const score = scoreFromPrediction(makePred({ homeWinProb: 0.6, drawProb: 0.2, awayWinProb: 0.2 }));
    expect(score.homeGoals).toBeGreaterThan(score.awayGoals);
  });

  it("assigns away win when away prob is highest", () => {
    const score = scoreFromPrediction(makePred({ homeWinProb: 0.2, drawProb: 0.2, awayWinProb: 0.6 }));
    expect(score.awayGoals).toBeGreaterThan(score.homeGoals);
  });

  it("assigns draw when draw prob is highest", () => {
    const score = scoreFromPrediction(makePred({ homeWinProb: 0.2, drawProb: 0.6, awayWinProb: 0.2 }));
    expect(score.homeGoals).toBe(score.awayGoals);
  });
});

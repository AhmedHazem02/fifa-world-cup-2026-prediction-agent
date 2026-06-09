import { describe, it, expect } from "vitest";
import { predictMatchHybrid } from "../src/predictions/hybridPredictor.js";
import { combineStatisticalAndAi } from "../src/predictions/combinePredictions.js";
import { MockAiProvider } from "../src/ai/mockAiProvider.js";
import { parseAiResponse } from "../src/ai/parseAiResponse.js";
import { GROUP_FIXTURES } from "../src/data/fixtures.js";
import { predictMatch } from "../src/predictions/matchPredictor.js";

describe("Hybrid predictor", () => {
  it("combines statistical and AI predictions", async () => {
    const fixture = GROUP_FIXTURES[0];
    const hybrid = await predictMatchHybrid({
      fixture,
      aiProvider: new MockAiProvider(),
      aiWeight: 0.3,
    });

    expect(hybrid.hybrid).toBe(true);
    expect(hybrid.homeWinProb + hybrid.drawProb + hybrid.awayWinProb).toBeCloseTo(1, 2);
    expect(hybrid.statistical).toBeDefined();
    expect(hybrid.ai.reasoning.length).toBeGreaterThan(0);
    expect(hybrid.aiWeight).toBe(0.3);
  });

  it("blends with configurable weight", () => {
    const statistical = predictMatch({ fixture: GROUP_FIXTURES[0] });
    const ai = {
      homeWinProb: 0.6, drawProb: 0.2, awayWinProb: 0.2,
      reasoning: "test", provider: "mock", model: "test",
    };
    const light = combineStatisticalAndAi(statistical, ai, 0.1);
    const heavy = combineStatisticalAndAi(statistical, ai, 0.5);
    expect(heavy.homeWinProb).toBeGreaterThan(light.homeWinProb);
  });

  it("parses AI JSON response", () => {
    const parsed = parseAiResponse(
      '{"homeWinProb":0.5,"drawProb":0.25,"awayWinProb":0.25,"reasoning":"Close game"}',
      "test",
      "test-model"
    );
    expect(parsed.homeWinProb).toBeCloseTo(0.5, 2);
    expect(parsed.reasoning).toContain("Close game");
  });
});

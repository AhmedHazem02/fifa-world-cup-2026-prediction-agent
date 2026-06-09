import { describe, it, expect } from "vitest";
import { getPredictionConfig, listPredictionConfigs } from "../src/config/predictionConfigs.js";
import { predictMatch } from "../src/predictions/matchPredictor.js";
import { GROUP_FIXTURES } from "../src/data/fixtures.js";

describe("Prediction configs", () => {
  it("lists all configs", () => {
    expect(listPredictionConfigs().length).toBeGreaterThanOrEqual(5);
  });

  it("throws on unknown config", () => {
    expect(() => getPredictionConfig("invalid")).toThrow(/Unknown config/);
  });

  it("produces different results per config", () => {
    const fixture = GROUP_FIXTURES[0];
    const balanced = predictMatch({ fixture, configId: "balanced" });
    const eloHeavy = predictMatch({ fixture, configId: "elo-heavy" });
    const conservative = predictMatch({ fixture, configId: "conservative" });

    expect(balanced.configId).toBe("balanced");
    expect(eloHeavy.configId).toBe("elo-heavy");
    expect(conservative.drawProb).toBeGreaterThan(balanced.drawProb);
  });
});

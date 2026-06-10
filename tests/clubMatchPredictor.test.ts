import { describe, it, expect } from "vitest";
import { buildClubMatchContext } from "../src/data/clubHistory.js";
import { recordsToTable } from "../src/data/csvTable.js";
import { predictClubStatistical } from "../src/predictions/clubStatistical.js";
import { predictClubs } from "../src/predictions/clubMatchPredictor.js";
import { MockClubAiProvider } from "../src/ai/clubAiProvider.js";
import { buildClubAiContext } from "../src/ai/buildClubContext.js";

const SAMPLE_CSV = `date,home_team,away_team,target__home_team__full_time_goals,target__away_team__full_time_goals
2020-01-01,Arsenal,Chelsea,2,1
2020-01-08,Chelsea,Arsenal,1,1
2020-01-15,Arsenal,Liverpool,3,0
2020-01-22,Liverpool,Chelsea,2,2
2020-01-29,Chelsea,Arsenal,0,2`;

function sampleTable() {
  const records = SAMPLE_CSV.trim().split("\n").slice(1).map((line) => {
    const [date, home_team, away_team, hg, ag] = line.split(",");
    return {
      date,
      home_team,
      away_team,
      target__home_team__full_time_goals: hg,
      target__away_team__full_time_goals: ag,
    };
  });
  return recordsToTable(records, false);
}

describe("Club match predictor", () => {
  it("builds context from historical CSV rows", () => {
    const context = buildClubMatchContext("Arsenal", "Chelsea", sampleTable());
    expect(context.resolvedHome).toBe("Arsenal");
    expect(context.resolvedAway).toBe("Chelsea");
    expect(context.homeRecord.played).toBeGreaterThan(0);
    expect(context.headToHead.played).toBe(1);
  });

  it("produces normalized statistical probabilities", () => {
    const context = buildClubMatchContext("Arsenal", "Chelsea", sampleTable());
    const stats = predictClubStatistical(context);
    expect(stats.homeWinProb + stats.drawProb + stats.awayWinProb).toBeCloseTo(1, 2);
    expect(stats.confidence).toBeGreaterThan(0);
  });

  it("mock club AI returns reasoning", async () => {
    const context = buildClubMatchContext("Arsenal", "Chelsea", sampleTable());
    const statistical = predictClubStatistical(context);
    const ai = await new MockClubAiProvider().predictClub(buildClubAiContext(context, statistical));
    expect(ai.reasoning.length).toBeGreaterThan(0);
    expect(ai.homeWinProb + ai.drawProb + ai.awayWinProb).toBeCloseTo(1, 2);
  });

  it("predictClubs with mock AI returns outcome and confidence", async () => {
    const result = await predictClubs("Arsenal", "Chelsea", {
      forceMockAi: true,
      useCache: false,
    });
    expect(["home", "draw", "away"]).toContain(result.outcome);
    expect(result.homeWinProb + result.drawProb + result.awayWinProb).toBeCloseTo(1, 2);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reasoning.length).toBeGreaterThan(0);
    expect(result.hybrid).toBe(true);
  });

  it("predictClubs statistical-only skips AI", async () => {
    const result = await predictClubs("Arsenal", "Chelsea", {
      useAi: false,
      useCache: false,
    });
    expect(result.model).toBe("statistical-club");
    expect(result.hybrid).toBe(false);
    expect(result.ai).toBeUndefined();
  });
});

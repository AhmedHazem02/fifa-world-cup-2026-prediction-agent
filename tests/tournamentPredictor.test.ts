import { describe, it, expect } from "vitest";
import { predictTournament, simulateGroupStandings } from "../src/predictions/tournamentPredictor.js";
import { getTeamById } from "../src/data/teams.js";
import { GROUP_FIXTURES } from "../src/data/fixtures.js";

describe("Tournament predictor", () => {
  it("simulates full group stage (12 groups × 6 matches = 72 fixtures)", () => {
    expect(GROUP_FIXTURES.length).toBe(72); // 12 groups × 6 matches (WC2026 48-team format)
    const standings = simulateGroupStandings();
    for (const table of Object.values(standings)) {
      expect(table.every((t) => t.played === 3)).toBe(true);
    }
  });

  it("picks a credible champion by Elo", () => {
    const result = predictTournament();
    const champion = getTeamById(result.championId)!;
    expect(champion.eloRating).toBeGreaterThan(1800);
    expect(result.configId).toBe("balanced");
  });

  it("respects config for tournament simulation", () => {
    const hostBias = predictTournament("host-bias");
    expect(hostBias.configId).toBe("host-bias");
  });
});

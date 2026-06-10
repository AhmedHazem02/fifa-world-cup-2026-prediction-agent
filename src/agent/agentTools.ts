import { predictMatch } from "../predictions/matchPredictor.js";
import { predictClubs } from "../predictions/clubMatchPredictor.js";
import { predictTournament, simulateGroupStandings } from "../predictions/tournamentPredictor.js";
import { getTeamById } from "../data/teams.js";
import type { AgentContext } from "./agentContext.js";

export const AGENT_TOOLS = {
  predict_match: "Predict outcome probabilities for a single match",
  predict_clubs: "Predict a club fixture from two team names",
  predict_tournament: "Simulate full tournament and predict champion",
  get_standings: "Calculate projected group stage standings",
  lookup_team: "Get team info by ID or code",
} as const;

export type ToolName = keyof typeof AGENT_TOOLS;

export async function executeTool(
  ctx: AgentContext,
  tool: ToolName,
  args: Record<string, string>
): Promise<unknown> {
  ctx.memory.queries.push(`${tool}:${JSON.stringify(args)}`);
  switch (tool) {
    case "predict_match": {
      const fixture = ctx.fixtures.find((f) => f.id === args.matchId);
      if (!fixture) throw new Error(`Fixture ${args.matchId} not found`);
      const pred = predictMatch({ fixture, configId: ctx.configId });
      ctx.memory.predictions.set(fixture.id, pred);
      return pred;
    }
    case "predict_clubs": {
      if (!args.home || !args.away) {
        throw new Error("predict_clubs requires home and away team names");
      }
      return await predictClubs(args.home, args.away, {
        forceMockAi: args.forceMockAi === "true",
        useAi: args.useAi !== "false",
      });
    }
    case "predict_tournament": {
      const result = predictTournament(ctx.configId);
      ctx.memory.lastTournament = result;
      return result;
    }
    case "get_standings":
      return simulateGroupStandings(ctx.configId);
    case "lookup_team": {
      const team = getTeamById(args.id) ?? getTeamById(args.code?.toLowerCase() ?? "");
      return team ?? null;
    }
    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

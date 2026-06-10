import { GROUP_FIXTURES } from "../data/fixtures.js";
import { createAgentContext, type AgentContext } from "./agentContext.js";
import { executeTool, type ToolName } from "./agentTools.js";
import { predictMatchHybrid } from "../predictions/hybridPredictor.js";
import { predictClubs as runClubPrediction } from "../predictions/clubMatchPredictor.js";
import type { MatchPrediction } from "../types/prediction.js";
import type { HybridMatchPrediction } from "../ai/types.js";
import type { ClubMatchPrediction } from "../types/club.js";

export class PredictionAgent {
  private ctx: AgentContext;

  constructor(verbose = false, configId = "balanced") {
    this.ctx = createAgentContext(GROUP_FIXTURES, verbose, configId);
  }

  setConfig(configId: string): void {
    this.ctx.configId = configId;
    this.ctx.memory.predictions.clear();
    this.ctx.memory.lastTournament = null;
  }

  getConfigId(): string {
    return this.ctx.configId;
  }

  async predictMatch(matchId: string): Promise<MatchPrediction> {
    return (await executeTool(this.ctx, "predict_match", { matchId })) as MatchPrediction;
  }

  async predictMatchHybrid(
    matchId: string,
    options: { aiWeight?: number; forceMockAi?: boolean } = {}
  ): Promise<HybridMatchPrediction> {
    const fixture = GROUP_FIXTURES.find((f) => f.id === matchId);
    if (!fixture) throw new Error(`Fixture ${matchId} not found`);
    const hybrid = await predictMatchHybrid({
      fixture,
      configId: this.ctx.configId,
      aiWeight: options.aiWeight,
      forceMockAi: options.forceMockAi,
    });
    this.ctx.memory.predictions.set(matchId, hybrid);
    return hybrid;
  }

  async predictClubs(
    home: string,
    away: string,
    options: { aiWeight?: number; forceMockAi?: boolean; useAi?: boolean } = {},
  ): Promise<ClubMatchPrediction> {
    const result = await runClubPrediction(home, away, options);
    this.ctx.memory.queries.push(`predict_clubs:${JSON.stringify({ home, away })}`);
    return result;
  }

  async predictAllGroupMatches(): Promise<MatchPrediction[]> {
    const preds: MatchPrediction[] = [];
    for (const f of GROUP_FIXTURES) {
      preds.push(await this.predictMatch(f.id));
    }
    return preds;
  }

  async runTool(tool: ToolName, args: Record<string, string> = {}): Promise<unknown> {
    return executeTool(this.ctx, tool, args);
  }

  getContext(): AgentContext {
    return this.ctx;
  }
}

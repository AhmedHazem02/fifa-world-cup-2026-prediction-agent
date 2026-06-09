import { GROUP_FIXTURES } from "../data/fixtures.js";
import { createAgentContext, type AgentContext } from "./agentContext.js";
import { executeTool, type ToolName } from "./agentTools.js";
import { predictMatchHybrid } from "../predictions/hybridPredictor.js";
import type { MatchPrediction } from "../types/prediction.js";
import type { HybridMatchPrediction } from "../ai/types.js";

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

  predictMatch(matchId: string): MatchPrediction {
    return executeTool(this.ctx, "predict_match", { matchId }) as MatchPrediction;
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

  predictAllGroupMatches(): MatchPrediction[] {
    return GROUP_FIXTURES.map((f) => this.predictMatch(f.id));
  }

  runTool(tool: ToolName, args: Record<string, string> = {}): unknown {
    return executeTool(this.ctx, tool, args);
  }

  getContext(): AgentContext {
    return this.ctx;
  }
}

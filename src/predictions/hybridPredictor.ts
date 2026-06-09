import { getAiConfig } from "../config/aiConfig.js";
import { getAiProvider } from "../ai/aiProvider.js";
import { buildMatchAiContext } from "../ai/buildMatchContext.js";
import { combineStatisticalAndAi } from "./combinePredictions.js";
import { predictMatch } from "./matchPredictor.js";
import { cacheGet, cacheSet } from "../utils/cache.js";
import type { MatchFixture } from "../types/match.js";
import type { AiProvider, HybridMatchPrediction } from "../ai/types.js";

export interface HybridPredictorInput {
  fixture: MatchFixture;
  configId?: string;
  aiWeight?: number;
  aiProvider?: AiProvider;
  forceMockAi?: boolean;
}

export async function predictMatchHybrid(
  input: HybridPredictorInput
): Promise<HybridMatchPrediction> {
  const aiWeight = input.aiWeight ?? getAiConfig().defaultBlendWeight;
  const cacheKey = `hybrid:${input.configId ?? "balanced"}:${aiWeight}:${input.fixture.id}`;
  const cached = cacheGet<HybridMatchPrediction>(cacheKey);
  if (cached) return cached;

  const statistical = predictMatch({
    fixture: input.fixture,
    configId: input.configId,
  });

  const provider = input.aiProvider ?? getAiProvider(input.forceMockAi);
  const context = buildMatchAiContext(input.fixture, statistical);
  const ai = await provider.predictMatch(context);
  const hybrid = combineStatisticalAndAi(statistical, ai, aiWeight);

  cacheSet(cacheKey, hybrid);
  return hybrid;
}

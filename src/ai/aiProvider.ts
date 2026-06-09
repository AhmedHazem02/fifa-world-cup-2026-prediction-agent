import { getAiConfig } from "../config/aiConfig.js";
import { MockAiProvider } from "./mockAiProvider.js";
import { OpenAiProvider } from "./openAiProvider.js";
import type { AiProvider } from "./types.js";

export function getAiProvider(forceMock = false): AiProvider {
  const cfg = getAiConfig();
  if (!forceMock && cfg.apiKey) {
    return new OpenAiProvider(cfg.model);
  }
  return new MockAiProvider();
}

export function describeAiProvider(provider: AiProvider): string {
  return `${provider.name} (${provider.model})`;
}

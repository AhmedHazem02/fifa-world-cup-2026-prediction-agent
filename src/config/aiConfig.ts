export interface AiConfig {
  enabled: boolean;
  apiKey: string | undefined;
  baseUrl: string;
  model: string;
  defaultBlendWeight: number;
  timeoutMs: number;
}

import { loadEnv } from "./env.js";

export function getAiConfig(): AiConfig {
  loadEnv();
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.AI_API_KEY;
  return {
    enabled: true,
    apiKey,
    baseUrl:
      process.env.AI_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      "https://api.openai.com/v1",
    model: process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    defaultBlendWeight: clamp(
      parseFloat(process.env.AI_BLEND_WEIGHT ?? "0.3"),
      0,
      0.8
    ),
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS ?? "30000", 10),
  };
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function isAiAvailable(): boolean {
  return true;
}

export function isLiveAiAvailable(): boolean {
  return Boolean(getAiConfig().apiKey) && process.env.AI_USE_MOCK !== "true";
}

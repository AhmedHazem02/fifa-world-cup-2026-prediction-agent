import { getPredictionConfig } from "../config/predictionConfigs.js";
import { getAiConfig } from "../config/aiConfig.js";

export interface ParsedCliArgs {
  command: string;
  positional: string[];
  configId: string;
  useAi: boolean;
  aiWeight: number;
  forceMockAi: boolean;
  noAi: boolean;
}

export function parseCliArgs(argv: string[]): ParsedCliArgs {
  const args = argv.slice(2);
  const command = args[0] ?? "help";
  let configId = "balanced";
  let useAi = false;
  let aiWeight = getAiConfig().defaultBlendWeight;
  let forceMockAi = false;
  let noAi = false;
  const positional: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--config" || arg === "-c") {
      configId = args[++i] ?? configId;
    } else if (arg === "--ai") {
      useAi = true;
    } else if (arg === "--ai-weight") {
      aiWeight = parseFloat(args[++i] ?? String(aiWeight));
    } else if (arg === "--mock-ai") {
      forceMockAi = true;
      useAi = true;
    } else if (arg === "--no-ai") {
      noAi = true;
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  if (command === "hybrid") useAi = true;
  if (command === "clubs" && !noAi) useAi = true;

  if (command !== "help" && command !== "configs" && command !== "clubs") {
    getPredictionConfig(configId);
  }

  aiWeight = Math.min(0.8, Math.max(0, Number.isNaN(aiWeight) ? 0.3 : aiWeight));

  return { command, positional, configId, useAi, aiWeight, forceMockAi, noAi };
}

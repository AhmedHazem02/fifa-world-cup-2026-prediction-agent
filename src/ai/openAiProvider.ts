import { request } from "undici";
import { getAiConfig } from "../config/aiConfig.js";
import { buildAiPrompt } from "./buildMatchContext.js";
import { parseAiResponse } from "./parseAiResponse.js";
import type { AiProvider, AiMatchPrediction, MatchAiContext } from "./types.js";

export class OpenAiProvider implements AiProvider {
  readonly name = "openai-compatible";
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? getAiConfig().model;
  }

  async predictMatch(context: MatchAiContext): Promise<AiMatchPrediction> {
    const cfg = getAiConfig();
    if (!cfg.apiKey) {
      throw new Error("OPENAI_API_KEY or AI_API_KEY is required for live AI predictions");
    }

    const prompt = buildAiPrompt(context);
    const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;

    const { statusCode, body } = await request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a football analytics expert for FIFA World Cup 2026. Respond only with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
      bodyTimeout: cfg.timeoutMs,
      headersTimeout: cfg.timeoutMs,
    });

    const responseText = await body.text();
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`AI API error ${statusCode}: ${responseText.slice(0, 200)}`);
    }

    const data = JSON.parse(responseText) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI API returned empty response");

    return parseAiResponse(content, this.name, this.model);
  }
}

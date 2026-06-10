import { request } from "undici";
import { getAiConfig } from "../config/aiConfig.js";
import { buildClubAiPrompt, type ClubAiContext } from "./buildClubContext.js";
import { parseAiResponse } from "./parseAiResponse.js";
import type { AiMatchPrediction } from "./types.js";

export interface ClubAiProvider {
  readonly name: string;
  readonly model: string;
  predictClub(context: ClubAiContext): Promise<AiMatchPrediction>;
}

/** Offline club AI — heuristic analysis without an API key. */
export class MockClubAiProvider implements ClubAiProvider {
  readonly name = "mock";
  readonly model = "mock-club-analyst-v1";

  async predictClub(context: ClubAiContext): Promise<AiMatchPrediction> {
    const { match, statistical } = context;
    let homeAdj = 0;
    let awayAdj = 0;
    let drawAdj = 0;

    if (match.homeRecord.played > match.awayRecord.played + 4) homeAdj += 0.04;
    if (match.awayRecord.played > match.homeRecord.played + 4) awayAdj += 0.04;

    const homeWinRate =
      match.homeRecord.played > 0 ? match.homeRecord.wins / match.homeRecord.played : 0.33;
    const awayWinRate =
      match.awayRecord.played > 0 ? match.awayRecord.wins / match.awayRecord.played : 0.33;
    if (homeWinRate > awayWinRate + 0.1) homeAdj += 0.05;
    else if (awayWinRate > homeWinRate + 0.1) awayAdj += 0.05;

    if (match.headToHead.played >= 2) {
      const h2hHome = match.headToHead.homeWins / match.headToHead.played;
      const h2hAway = match.headToHead.awayWins / match.headToHead.played;
      if (h2hHome > h2hAway) homeAdj += 0.03;
      else if (h2hAway > h2hHome) awayAdj += 0.03;
      else drawAdj += 0.03;
    }

    const blended = {
      home: statistical.homeWinProb * 0.7 + homeAdj,
      draw: statistical.drawProb * 0.7 + drawAdj,
      away: statistical.awayWinProb * 0.7 + awayAdj,
    };
    const sum = blended.home + blended.draw + blended.away;

    const reasons: string[] = [];
    if (homeAdj > awayAdj) reasons.push(`${match.homeTeam} stronger recent form`);
    else if (awayAdj > homeAdj) reasons.push(`${match.awayTeam} stronger recent form`);
    if (match.headToHead.played > 0) reasons.push("head-to-head history considered");

    return {
      homeWinProb: Math.round((blended.home / sum) * 1000) / 1000,
      drawProb: Math.round((blended.draw / sum) * 1000) / 1000,
      awayWinProb: Math.round((blended.away / sum) * 1000) / 1000,
      reasoning:
        reasons.length > 0
          ? `Mock club analysis: ${reasons.join("; ")}.`
          : "Mock club analysis: balanced contest with slight statistical lean.",
      provider: this.name,
      model: this.model,
    };
  }
}

export class OpenClubAiProvider implements ClubAiProvider {
  readonly name = "openai-compatible";
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? getAiConfig().model;
  }

  async predictClub(context: ClubAiContext): Promise<AiMatchPrediction> {
    const cfg = getAiConfig();
    if (!cfg.apiKey) {
      throw new Error("OPENAI_API_KEY or AI_API_KEY is required for live club AI predictions");
    }

    const prompt = buildClubAiPrompt(context);
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
            content: "You are a club soccer analytics expert. Respond only with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
      bodyTimeout: cfg.timeoutMs,
      headersTimeout: cfg.timeoutMs,
    });

    const responseText = await body.text();
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`Club AI API error ${statusCode}: ${responseText.slice(0, 200)}`);
    }

    const data = JSON.parse(responseText) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Club AI API returned empty response");

    return parseAiResponse(content, this.name, this.model);
  }
}

export function getClubAiProvider(forceMock = false): ClubAiProvider {
  const cfg = getAiConfig();
  if (!forceMock && cfg.apiKey && process.env.AI_USE_MOCK !== "true") {
    return new OpenClubAiProvider(cfg.model);
  }
  return new MockClubAiProvider();
}

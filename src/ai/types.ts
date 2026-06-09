import type { Team } from "../types/team.js";
import type { MatchFixture } from "../types/match.js";
import type { MatchPrediction } from "../types/prediction.js";

export interface AiMatchPrediction {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals?: number;
  expectedAwayGoals?: number;
  reasoning: string;
  provider: string;
  model: string;
}

export interface MatchAiContext {
  fixture: MatchFixture;
  home: Team;
  away: Team;
  statistical: MatchPrediction;
  venueName?: string;
  homeFormSummary: string;
  awayFormSummary: string;
}

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  predictMatch(context: MatchAiContext): Promise<AiMatchPrediction>;
}

export interface HybridMatchPrediction extends MatchPrediction {
  statistical: MatchPrediction;
  ai: AiMatchPrediction;
  aiWeight: number;
  hybrid: boolean;
}

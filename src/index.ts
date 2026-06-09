export { PredictionAgent } from "./agent/predictionAgent.js";
export { predictMatch } from "./predictions/matchPredictor.js";
export { predictMatchHybrid } from "./predictions/hybridPredictor.js";
export { combineStatisticalAndAi } from "./predictions/combinePredictions.js";
export { predictTournament, simulateGroupStandings } from "./predictions/tournamentPredictor.js";
export { getAiProvider, describeAiProvider } from "./ai/aiProvider.js";
export { getAiConfig, isAiAvailable, isLiveAiAvailable } from "./config/aiConfig.js";
export { findValueBets } from "./odds/valueBet.js";
export { calculateKellyCriterion, americanToDecimal } from "./utils/kellyCriterion.js";
export { expectedValue, calculateEdge } from "./utils/expectedValue.js";
export { TEAMS, getTeamById } from "./data/teams.js";
export { GROUP_FIXTURES } from "./data/fixtures.js";
export {
  PREDICTION_CONFIGS,
  getPredictionConfig,
  listPredictionConfigs,
  DEFAULT_CONFIG_ID,
} from "./config/predictionConfigs.js";
export type { PredictionConfig, ModelWeights } from "./config/predictionConfigs.js";
export type { AiMatchPrediction, HybridMatchPrediction, AiProvider } from "./ai/types.js";
export type { MatchPrediction, TournamentPrediction, ValueBet } from "./types/prediction.js";
export type { Team } from "./types/team.js";
export type { MatchFixture } from "./types/match.js";

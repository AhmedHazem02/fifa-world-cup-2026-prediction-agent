export interface ModelWeights {
  elo: number;
  poisson: number;
  form: number;
  squad: number;
}

export interface PredictionConfig {
  id: string;
  name: string;
  description: string;
  weights: ModelWeights;
  homeAdvantage: number;
  hostHomeAdvantage: number;
  drawBias: number;
  useHostVenueBonus: boolean;
  useAltitudeFactor: boolean;
}

export const PREDICTION_CONFIGS: Record<string, PredictionConfig> = {
  balanced: {
    id: "balanced",
    name: "Balanced",
    description: "Default ensemble — equal blend of Elo, goals, and form",
    weights: { elo: 0.35, poisson: 0.30, form: 0.20, squad: 0.15 },
    homeAdvantage: 65,
    hostHomeAdvantage: 80,
    drawBias: 1.0,
    useHostVenueBonus: true,
    useAltitudeFactor: true,
  },
  "elo-heavy": {
    id: "elo-heavy",
    name: "Elo Heavy",
    description: "Trusts FIFA/Elo rankings — best for mismatched favorites",
    weights: { elo: 0.55, poisson: 0.25, form: 0.12, squad: 0.08 },
    homeAdvantage: 70,
    hostHomeAdvantage: 85,
    drawBias: 0.95,
    useHostVenueBonus: true,
    useAltitudeFactor: false,
  },
  "form-heavy": {
    id: "form-heavy",
    name: "Form Heavy",
    description: "Weights recent results — catches hot/cold streaks",
    weights: { elo: 0.18, poisson: 0.22, form: 0.45, squad: 0.15 },
    homeAdvantage: 60,
    hostHomeAdvantage: 75,
    drawBias: 1.0,
    useHostVenueBonus: false,
    useAltitudeFactor: false,
  },
  "goals-heavy": {
    id: "goals-heavy",
    name: "Goals Heavy",
    description: "Poisson/xG driven — best for over/under and scorelines",
    weights: { elo: 0.15, poisson: 0.55, form: 0.20, squad: 0.10 },
    homeAdvantage: 55,
    hostHomeAdvantage: 70,
    drawBias: 0.9,
    useHostVenueBonus: true,
    useAltitudeFactor: true,
  },
  conservative: {
    id: "conservative",
    name: "Conservative",
    description: "Higher draw weight — safer for accumulator bets",
    weights: { elo: 0.30, poisson: 0.30, form: 0.25, squad: 0.15 },
    homeAdvantage: 60,
    hostHomeAdvantage: 75,
    drawBias: 1.3,
    useHostVenueBonus: true,
    useAltitudeFactor: true,
  },
  "host-bias": {
    id: "host-bias",
    name: "Host Bias",
    description: "Amplifies USA/MEX/CAN home advantage at host venues",
    weights: { elo: 0.30, poisson: 0.25, form: 0.25, squad: 0.20 },
    homeAdvantage: 75,
    hostHomeAdvantage: 110,
    drawBias: 1.0,
    useHostVenueBonus: true,
    useAltitudeFactor: true,
  },
};

export const DEFAULT_CONFIG_ID = "balanced";

export function getPredictionConfig(id?: string): PredictionConfig {
  const key = id ?? DEFAULT_CONFIG_ID;
  const config = PREDICTION_CONFIGS[key];
  if (!config) {
    const available = Object.keys(PREDICTION_CONFIGS).join(", ");
    throw new Error(`Unknown config "${key}". Available: ${available}`);
  }
  return config;
}

export function listPredictionConfigs(): PredictionConfig[] {
  return Object.values(PREDICTION_CONFIGS);
}

export interface ClubTeamRecord {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface ClubHeadToHeadRecord {
  played: number;
  homeWins: number;
  draws: number;
  awayWins: number;
}

export interface ClubMatchContext {
  homeTeam: string;
  awayTeam: string;
  resolvedHome: string | null;
  resolvedAway: string | null;
  homeRecord: ClubTeamRecord;
  awayRecord: ClubTeamRecord;
  headToHead: ClubHeadToHeadRecord;
  leagueDrawRate: number;
}

export interface ClubStatisticalPrediction {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  confidence: number;
}

export interface ClubMatchPrediction {
  homeTeam: string;
  awayTeam: string;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  outcome: "home" | "draw" | "away";
  confidence: number;
  reasoning: string;
  model: string;
  resolvedHome: string | null;
  resolvedAway: string | null;
  context: {
    homeMatches: number;
    awayMatches: number;
    headToHeadMatches: number;
    leagueDrawRate: number;
  };
  statistical: ClubStatisticalPrediction;
  ai?: {
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
    reasoning: string;
    provider: string;
    model: string;
  };
  aiWeight?: number;
  hybrid?: boolean;
}

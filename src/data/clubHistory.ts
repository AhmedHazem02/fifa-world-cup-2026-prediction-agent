import { fetch } from "undici";
import { cacheGet, cacheSet } from "../utils/cache.js";
import {
  concatTables,
  parseCsvText,
  recordsToTable,
  rowCount,
  type HistoryTable,
} from "./csvTable.js";
import type { ClubHeadToHeadRecord, ClubMatchContext, ClubTeamRecord } from "../types/club.js";

export const TRAINING_URL =
  "https://raw.githubusercontent.com/georgedouzas/sports-betting/data/data/soccer/modelling/{league}_{division}_{year}.csv";
export const FIXTURES_URL =
  "https://raw.githubusercontent.com/georgedouzas/sports-betting/data/data/soccer/modelling/fixtures.csv";

const LEAGUE_GRID = [
  { league: "England", division: 1, year: 2020 },
  { league: "England", division: 2, year: 2020 },
  { league: "Spain", division: 1, year: 2020 },
  { league: "Italy", division: 1, year: 2020 },
  { league: "Germany", division: 1, year: 2020 },
  { league: "France", division: 1, year: 2020 },
];

let cachedHistory: HistoryTable | null = null;

async function fetchCsv(url: string, useCache = true): Promise<Record<string, string>[]> {
  const cacheKey = `club-csv:${url}`;
  if (useCache) {
    const cached = cacheGet<string>(cacheKey);
    if (cached) return parseCsvText(cached);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const text = await response.text();
  if (useCache) cacheSet(cacheKey, text, 3_600_000);
  return parseCsvText(text);
}

/** Download league CSV history from the sports-betting data repository. */
export async function loadClubHistory(useCache = true): Promise<HistoryTable> {
  if (cachedHistory) return cachedHistory;

  const frames: HistoryTable[] = [];
  const errors: string[] = [];

  for (const { league, division, year } of LEAGUE_GRID) {
    const url = TRAINING_URL.replace("{league}", league)
      .replace("{division}", String(division))
      .replace("{year}", String(year));
    try {
      const records = await fetchCsv(url, useCache);
      if (records.length > 0) frames.push(recordsToTable(records, false));
    } catch (err) {
      errors.push(`${league} div${division} ${year}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  try {
    const fixRecords = await fetchCsv(FIXTURES_URL, useCache);
    if (fixRecords.length > 0) frames.push(recordsToTable(fixRecords, true));
  } catch (err) {
    errors.push(`fixtures: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (frames.length === 0) {
    const detail = errors.length ? ` Errors: ${errors.join("; ")}` : "";
    throw new Error(`Could not download club soccer history.${detail}`);
  }

  let combined = frames[0]!;
  for (let i = 1; i < frames.length; i++) {
    combined = concatTables(combined, frames[i]!);
  }
  cachedHistory = combined;
  return combined;
}

export function trainingTable(data: HistoryTable): HistoryTable {
  const fixtures = (data.columns.fixtures ?? []).map((v) => Boolean(v));
  const trainMask = fixtures.map((f) => !f);
  const columns: HistoryTable["columns"] = {};
  for (const [key, values] of Object.entries(data.columns)) {
    if (key === "fixtures") continue;
    columns[key] = values.filter((_, i) => trainMask[i]);
  }
  return {
    index: data.index.filter((_, i) => trainMask[i]),
    columns,
  };
}

function normalizeTeam(name: string): string {
  return name.trim().toLowerCase();
}

export function teamsMatch(a: string, b: string): boolean {
  const left = normalizeTeam(a);
  const right = normalizeTeam(b);
  return left === right || left.includes(right) || right.includes(left);
}

function emptyRecord(): ClubTeamRecord {
  return { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
}

function emptyH2H(): ClubHeadToHeadRecord {
  return { played: 0, homeWins: 0, draws: 0, awayWins: 0 };
}

function resolveTeamName(query: string, candidates: string[]): string | null {
  const exact = candidates.find((c) => normalizeTeam(c) === normalizeTeam(query));
  if (exact) return exact;
  const partial = candidates.find((c) => teamsMatch(c, query));
  return partial ?? null;
}

function outcome(homeGoals: number, awayGoals: number): "home" | "draw" | "away" {
  if (homeGoals > awayGoals) return "home";
  if (homeGoals < awayGoals) return "away";
  return "draw";
}

function addResult(
  record: ClubTeamRecord,
  result: "win" | "draw" | "loss",
  gf: number,
  ga: number,
): void {
  record.played += 1;
  record.goalsFor += gf;
  record.goalsAgainst += ga;
  if (result === "win") record.wins += 1;
  else if (result === "draw") record.draws += 1;
  else record.losses += 1;
}

/** Build club form and head-to-head stats from historical match tables. */
export function buildClubMatchContext(
  homeTeam: string,
  awayTeam: string,
  data: HistoryTable,
): ClubMatchContext {
  const homeCol = (data.columns.home_team ?? []).map((v) => (typeof v === "string" ? v : null));
  const awayCol = (data.columns.away_team ?? []).map((v) => (typeof v === "string" ? v : null));
  const homeGoalsCol = data.columns.target__home_team__full_time_goals ?? [];
  const awayGoalsCol = data.columns.target__away_team__full_time_goals ?? [];

  const allTeams = [
    ...new Set(
      [...homeCol, ...awayCol].filter((v): v is string => typeof v === "string" && v.length > 0),
    ),
  ];

  const resolvedHome = resolveTeamName(homeTeam, allTeams);
  const resolvedAway = resolveTeamName(awayTeam, allTeams);

  const homeRecord = emptyRecord();
  const awayRecord = emptyRecord();
  const headToHead = emptyH2H();
  let draws = 0;
  let finished = 0;

  for (let i = 0; i < rowCount(data); i++) {
    const home = homeCol[i];
    const away = awayCol[i];
    const hg = Number(homeGoalsCol[i]);
    const ag = Number(awayGoalsCol[i]);
    if (typeof home !== "string" || typeof away !== "string") continue;
    if (Number.isNaN(hg) || Number.isNaN(ag)) continue;

    finished += 1;
    const result = outcome(hg, ag);
    if (result === "draw") draws += 1;

    if (resolvedHome && teamsMatch(home, resolvedHome)) {
      addResult(
        homeRecord,
        result === "home" ? "win" : result === "draw" ? "draw" : "loss",
        hg,
        ag,
      );
    }
    if (resolvedAway && teamsMatch(away, resolvedAway)) {
      addResult(
        awayRecord,
        result === "away" ? "win" : result === "draw" ? "draw" : "loss",
        ag,
        hg,
      );
    }

    if (
      resolvedHome &&
      resolvedAway &&
      teamsMatch(home, resolvedHome) &&
      teamsMatch(away, resolvedAway)
    ) {
      headToHead.played += 1;
      if (result === "home") headToHead.homeWins += 1;
      else if (result === "draw") headToHead.draws += 1;
      else headToHead.awayWins += 1;
    }
  }

  return {
    homeTeam,
    awayTeam,
    resolvedHome,
    resolvedAway,
    homeRecord,
    awayRecord,
    headToHead,
    leagueDrawRate: finished > 0 ? draws / finished : 0.25,
  };
}

export function clearClubHistoryCache(): void {
  cachedHistory = null;
}

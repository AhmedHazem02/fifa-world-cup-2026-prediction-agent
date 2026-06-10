import { parse } from "csv-parse/sync";

export type CellValue = string | number | boolean | null | Date;

export interface HistoryTable {
  index: Date[];
  columns: Record<string, CellValue[]>;
}

export function parseCsvText(text: string): Record<string, string>[] {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];
}

function parseDate(value: string): Date {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date(NaN) : d;
}

function inferFixtures(records: Record<string, string>[]): boolean[] {
  return records.map((r) => {
    const home = r["target__home_team__full_time_goals"];
    const away = r["target__away_team__full_time_goals"];
    const missing = (v: string | undefined) => v === undefined || v === "" || v === "-";
    return missing(home) && missing(away);
  });
}

export function recordsToTable(
  records: Record<string, string>[],
  fixturesFlag?: boolean,
): HistoryTable {
  if (records.length === 0) {
    return { index: [], columns: { fixtures: [] } };
  }

  const dates = records.map((r) => parseDate(r.date ?? ""));
  const columns: Record<string, CellValue[]> = {};
  const keys = Object.keys(records[0] ?? {}).filter((k) => k !== "date" && k !== "fixtures");

  for (const key of keys) {
    columns[key] = records.map((r) => {
      const raw = r[key];
      if (raw === undefined || raw === "" || raw === "-") return null;
      const num = Number(raw);
      return Number.isNaN(num) ? raw : num;
    });
  }

  const hasFixturesCol = "fixtures" in (records[0] ?? {});
  columns.fixtures = hasFixturesCol
    ? records.map((r) => r.fixtures === "true" || r.fixtures === "1")
    : fixturesFlag !== undefined
      ? records.map(() => fixturesFlag)
      : inferFixtures(records);

  return { index: dates, columns };
}

export function concatTables(a: HistoryTable, b: HistoryTable): HistoryTable {
  const keys = new Set([...Object.keys(a.columns), ...Object.keys(b.columns)]);
  const columns: Record<string, CellValue[]> = {};
  const nA = a.index.length;
  const nB = b.index.length;
  for (const key of keys) {
    columns[key] = [
      ...(a.columns[key] ?? Array(nA).fill(null)),
      ...(b.columns[key] ?? Array(nB).fill(null)),
    ];
  }
  return { index: [...a.index, ...b.index], columns };
}

export function rowCount(table: HistoryTable): number {
  return table.index.length;
}

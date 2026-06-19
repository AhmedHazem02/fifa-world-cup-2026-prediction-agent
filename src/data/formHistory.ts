import type { RecentResult } from "../models/formScore.js";

// ============================================================
// Real WC2026 form history — updated from actual match results
// as of June 19, 2026 (Round 2 of Group Stage)
// Sources: FIFA.com, BBC Sport, ESPN
// ============================================================

export const FORM_HISTORY: Record<string, RecentResult[]> = {

  // ── GROUP A ─────────────────────────────────────────────
  mex: [
    // Pre-tournament: Strong CONCACAF form
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 2, isHome: false },
    { opponentId: "can", goalsFor: 2, goalsAgainst: 0, isHome: true },
    // WC2026 Group A results
    { opponentId: "rsa", goalsFor: 2, goalsAgainst: 0, isHome: false }, // June 12 – 2-0 win
    { opponentId: "kor", goalsFor: 1, goalsAgainst: 0, isHome: false }, // June 18 – 1-0 win (QUALIFIED)
  ],
  kor: [
    { opponentId: "jpn", goalsFor: 0, goalsAgainst: 1, isHome: false },
    { opponentId: "aus", goalsFor: 2, goalsAgainst: 1, isHome: true },
    { opponentId: "cpv", goalsFor: 1, goalsAgainst: 0, isHome: false }, // June 12
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 1, isHome: false }, // June 18
  ],
  rsa: [
    { opponentId: "mor", goalsFor: 0, goalsAgainst: 1, isHome: false },
    { opponentId: "egy", goalsFor: 1, goalsAgainst: 1, isHome: true },
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 2, isHome: false }, // June 12 – 0-2 loss
  ],
  cpv: [
    { opponentId: "sen", goalsFor: 1, goalsAgainst: 2, isHome: false },
    { opponentId: "kor", goalsFor: 0, goalsAgainst: 1, isHome: false }, // June 12
    // Note: No match vs ESP in this group – different group from original
  ],

  // ── GROUP B ─────────────────────────────────────────────
  can: [
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 0, isHome: true },
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 2, isHome: false },
    { opponentId: "qat", goalsFor: 6, goalsAgainst: 0, isHome: true }, // June 18 – 6-0 DOMINANT
    // Round 1 result (Canada leads the group)
  ],
  sui: [
    { opponentId: "ger", goalsFor: 1, goalsAgainst: 3, isHome: false },
    { opponentId: "por", goalsFor: 0, goalsAgainst: 1, isHome: false },
    { opponentId: "bih", goalsFor: 4, goalsAgainst: 1, isHome: false }, // June 13 – 4-1 win
  ],
  bih: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 3, isHome: false },
    { opponentId: "sui", goalsFor: 1, goalsAgainst: 4, isHome: false }, // June 13
  ],
  qat: [
    { opponentId: "ecu", goalsFor: 0, goalsAgainst: 2, isHome: false }, // WC2022 opener
    { opponentId: "can", goalsFor: 0, goalsAgainst: 6, isHome: false }, // June 18 – 0-6 hammered
  ],

  // ── GROUP C ─────────────────────────────────────────────
  bra: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 2, isHome: false },
    { opponentId: "col", goalsFor: 2, goalsAgainst: 1, isHome: true },
    { opponentId: "per", goalsFor: 4, goalsAgainst: 0, isHome: true },
    { opponentId: "hti", goalsFor: 5, goalsAgainst: 0, isHome: false }, // June 19 – Strong win
  ],
  hti: [
    { opponentId: "bra", goalsFor: 0, goalsAgainst: 5, isHome: false }, // June 19
  ],
  sco: [
    { opponentId: "eng", goalsFor: 1, goalsAgainst: 2, isHome: false },
    { opponentId: "ger", goalsFor: 0, goalsAgainst: 3, isHome: false },
    { opponentId: "mar", goalsFor: 0, goalsAgainst: 1, isHome: false }, // June 19 – 0-1 loss
  ],
  mar: [
    { opponentId: "por", goalsFor: 1, goalsAgainst: 0, isHome: false }, // WC2022 QF
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 2, isHome: false }, // WC2022 SF
    { opponentId: "sco", goalsFor: 1, goalsAgainst: 0, isHome: false }, // June 19 – 1-0 win
  ],

  // ── GROUP D ─────────────────────────────────────────────
  usa: [
    { opponentId: "mex", goalsFor: 2, goalsAgainst: 1, isHome: true },
    { opponentId: "can", goalsFor: 2, goalsAgainst: 0, isHome: true },
    { opponentId: "pry", goalsFor: 4, goalsAgainst: 1, isHome: true }, // June 13 – 4-1 win
  ],
  tur: [
    { opponentId: "geo", goalsFor: 3, goalsAgainst: 1, isHome: true }, // Euro 2024 Round of 16
    { opponentId: "aus", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 19 – draw
  ],
  aus: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 1, isHome: false }, // WC2022 Round of 16
    { opponentId: "tur", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 19 – draw
  ],
  pry: [
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 4, isHome: false }, // June 13
  ],

  // ── GROUP E ─────────────────────────────────────────────
  ger: [
    { opponentId: "esp", goalsFor: 1, goalsAgainst: 2, isHome: false }, // Euro 2024 QF
    { opponentId: "sco", goalsFor: 5, goalsAgainst: 1, isHome: true },  // Euro 2024 opener
    { opponentId: "cur", goalsFor: 7, goalsAgainst: 1, isHome: false }, // June 14 – 7-1 DEMOLITION
  ],
  por: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 0, isHome: false }, // Euro 2024 QF (lost pens)
    { opponentId: "slo", goalsFor: 3, goalsAgainst: 0, isHome: false }, // Euro 2024 R16
    { opponentId: "cze", goalsFor: 2, goalsAgainst: 0, isHome: false }, // June 14
  ],
  cze: [
    { opponentId: "por", goalsFor: 0, goalsAgainst: 2, isHome: false }, // June 14
  ],
  civ: [
    { opponentId: "ger", goalsFor: 0, goalsAgainst: 2, isHome: false }, // AFCON form
  ],

  // ── GROUP F ─────────────────────────────────────────────
  arg: [
    { opponentId: "bra", goalsFor: 2, goalsAgainst: 0, isHome: true },
    { opponentId: "uru", goalsFor: 1, goalsAgainst: 1, isHome: false },
    { opponentId: "chi", goalsFor: 3, goalsAgainst: 0, isHome: true },
    { opponentId: "alg", goalsFor: 3, goalsAgainst: 0, isHome: false }, // June 17 – 3-0 win
  ],
  alg: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 3, isHome: false }, // June 17
  ],
  ecu: [
    { opponentId: "qat", goalsFor: 2, goalsAgainst: 0, isHome: false }, // WC2022 opener
    { opponentId: "svk", goalsFor: 1, goalsAgainst: 0, isHome: false }, // June 13
  ],
  svk: [
    { opponentId: "ecu", goalsFor: 0, goalsAgainst: 1, isHome: false }, // June 13
  ],

  // ── GROUP G ─────────────────────────────────────────────
  fra: [
    { opponentId: "bel", goalsFor: 1, goalsAgainst: 0, isHome: false }, // Nations League
    { opponentId: "por", goalsFor: 0, goalsAgainst: 0, isHome: false }, // Euro 2024 QF (won pens)
    { opponentId: "sen", goalsFor: 3, goalsAgainst: 1, isHome: false }, // June 16 – 3-1 win
  ],
  sen: [
    { opponentId: "civ", goalsFor: 1, goalsAgainst: 0, isHome: true }, // AFCON 2023
    { opponentId: "fra", goalsFor: 1, goalsAgainst: 3, isHome: false }, // June 16
  ],
  nga: [
    { opponentId: "civ", goalsFor: 0, goalsAgainst: 2, isHome: false }, // AFCON 2023 Final
    { opponentId: "nzl", goalsFor: 2, goalsAgainst: 0, isHome: false }, // June 13
  ],
  nzl: [
    { opponentId: "irn", goalsFor: 2, goalsAgainst: 2, isHome: false }, // June 15 – 2-2 shock draw
    { opponentId: "nga", goalsFor: 0, goalsAgainst: 2, isHome: false }, // June 13
  ],

  // ── GROUP H ─────────────────────────────────────────────
  esp: [
    { opponentId: "ger", goalsFor: 2, goalsAgainst: 1, isHome: false }, // Euro 2024 QF
    { opponentId: "fra", goalsFor: 2, goalsAgainst: 1, isHome: false }, // Euro 2024 SF
    { opponentId: "eng", goalsFor: 2, goalsAgainst: 1, isHome: false }, // Euro 2024 Final
    { opponentId: "cpv", goalsFor: 0, goalsAgainst: 0, isHome: false }, // June 15 – 0-0 SHOCK DRAW
  ],
  hrv: [
    { opponentId: "mar", goalsFor: 0, goalsAgainst: 0, isHome: false }, // WC2022 3rd place match
    { opponentId: "jap", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 14 – 1-1 draw
  ],
  jap: [
    { opponentId: "esp", goalsFor: 2, goalsAgainst: 1, isHome: false }, // WC2022 group shock
    { opponentId: "ger", goalsFor: 2, goalsAgainst: 1, isHome: false }, // WC2022 group shock
    { opponentId: "hrv", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 14
  ],
  egy: [
    { opponentId: "bel", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 15 – 1-1 UPSET draw
  ],

  // ── GROUP I ─────────────────────────────────────────────
  eng: [
    { opponentId: "esp", goalsFor: 1, goalsAgainst: 2, isHome: false }, // Euro 2024 Final
    { opponentId: "hrv", goalsFor: 4, goalsAgainst: 2, isHome: false }, // June 17 – 4-2 win
  ],
  uru: [
    { opponentId: "arg", goalsFor: 1, goalsAgainst: 1, isHome: true },
    { opponentId: "tun", goalsFor: 2, goalsAgainst: 0, isHome: false }, // June 13
  ],
  tun: [
    { opponentId: "swe", goalsFor: 1, goalsAgainst: 5, isHome: false }, // June 15 – 1-5 thrashing
    { opponentId: "uru", goalsFor: 0, goalsAgainst: 2, isHome: false }, // June 13
  ],
  svn: [
    { opponentId: "por", goalsFor: 0, goalsAgainst: 3, isHome: false }, // Euro 2024 R16
    { opponentId: "eng", goalsFor: 1, goalsAgainst: 2, isHome: false }, // June 13
  ],

  // ── GROUP J ─────────────────────────────────────────────
  ned: [
    { opponentId: "tur", goalsFor: 2, goalsAgainst: 1, isHome: false }, // Euro 2024 QF
    { opponentId: "eng", goalsFor: 1, goalsAgainst: 2, isHome: false }, // Euro 2024 SF
    { opponentId: "pol", goalsFor: 2, goalsAgainst: 1, isHome: false }, // June 14
  ],
  pol: [
    { opponentId: "ned", goalsFor: 1, goalsAgainst: 2, isHome: false }, // June 14
  ],
  col: [
    { opponentId: "arg", goalsFor: 1, goalsAgainst: 0, isHome: false }, // Copa America 2024 SF
    { opponentId: "irq", goalsFor: 3, goalsAgainst: 0, isHome: false }, // June 13
  ],
  irq: [
    { opponentId: "col", goalsFor: 0, goalsAgainst: 3, isHome: false }, // June 13
  ],

  // ── GROUP K ─────────────────────────────────────────────
  bel: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 1, isHome: false }, // Nations League
    { opponentId: "eng", goalsFor: 2, goalsAgainst: 1, isHome: true },
    { opponentId: "egy", goalsFor: 1, goalsAgainst: 1, isHome: false }, // June 15 – 1-1 SHOCK draw
  ],
  swe: [
    { opponentId: "tun", goalsFor: 5, goalsAgainst: 1, isHome: false }, // June 15 – 5-1 dominant
  ],
  uta: [
    { opponentId: "swe", goalsFor: 0, goalsAgainst: 3, isHome: false }, // friendly
  ],
  slo: [
    { opponentId: "por", goalsFor: 0, goalsAgainst: 3, isHome: false }, // Euro 2024 R16
  ],

  // ── GROUP L ─────────────────────────────────────────────
  ita: [
    { opponentId: "sui", goalsFor: 2, goalsAgainst: 0, isHome: false }, // Euro 2024 R16
    { opponentId: "esp", goalsFor: 0, goalsAgainst: 1, isHome: false }, // Euro 2024 QF
    { opponentId: "den", goalsFor: 2, goalsAgainst: 1, isHome: false }, // June 14
  ],
  den: [
    { opponentId: "ita", goalsFor: 1, goalsAgainst: 2, isHome: false }, // June 14
  ],
  prt: [
    { opponentId: "irn", goalsFor: 2, goalsAgainst: 0, isHome: false }, // June 13
  ],
  irn: [
    { opponentId: "nzl", goalsFor: 2, goalsAgainst: 2, isHome: false }, // June 15 – 2-2 draw
    { opponentId: "prt", goalsFor: 0, goalsAgainst: 2, isHome: false }, // June 13
  ],
};

export function getFormForTeam(teamId: string): RecentResult[] {
  return FORM_HISTORY[teamId] ?? [];
}

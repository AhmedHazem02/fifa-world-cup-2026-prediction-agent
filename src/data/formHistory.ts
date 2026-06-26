import type { RecentResult } from "../models/formScore.js";

// ============================================================
// WC2026 form history — updated from actual match results
// as of June 19, 2026 (Rounds 1 & 2 of Group Stage)
// Sources: FIFA.com, BBC Sport, ESPN
// Pre-tournament friendlies kept for Poisson model accuracy
// ============================================================

export const FORM_HISTORY: Record<string, RecentResult[]> = {

  // ── GROUP A ─────────────────────────────────────────────
  mex: [
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 2, isHome: false },  // pre-tournament
    { opponentId: "can", goalsFor: 2, goalsAgainst: 0, isHome: true },   // pre-tournament
    { opponentId: "rsa", goalsFor: 2, goalsAgainst: 0, isHome: false },  // Jun 12 – 2-0 win
    { opponentId: "kor", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 18 – 1-0 win
  ],
  kor: [
    { opponentId: "jpn", goalsFor: 0, goalsAgainst: 1, isHome: false },  // pre-tournament
    { opponentId: "aus", goalsFor: 2, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "cze", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Jun 12 – 2-1 win
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 18 – 0-1 loss
  ],
  rsa: [
    { opponentId: "mor", goalsFor: 0, goalsAgainst: 1, isHome: false },  // pre-tournament
    { opponentId: "egy", goalsFor: 1, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 2, isHome: false },  // Jun 12 – 0-2 loss
    { opponentId: "cze", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 18 – 1-1 draw
  ],
  cze: [
    { opponentId: "kor", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Jun 12 – 1-2 loss
    { opponentId: "rsa", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 18 – 1-1 draw
  ],

  // ── GROUP B ─────────────────────────────────────────────
  can: [
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 0, isHome: true },   // pre-tournament
    { opponentId: "mex", goalsFor: 0, goalsAgainst: 2, isHome: false },  // pre-tournament
    { opponentId: "bih", goalsFor: 1, goalsAgainst: 1, isHome: true },   // Jun 13 – 1-1 draw
    { opponentId: "qat", goalsFor: 6, goalsAgainst: 0, isHome: true },   // Jun 18 – 6-0 win
  ],
  sui: [
    { opponentId: "ger", goalsFor: 1, goalsAgainst: 3, isHome: false },  // pre-tournament
    { opponentId: "por", goalsFor: 0, goalsAgainst: 1, isHome: false },  // pre-tournament
    { opponentId: "qat", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 13 – 1-1 draw
    { opponentId: "bih", goalsFor: 4, goalsAgainst: 1, isHome: false },  // Jun 18 – 4-1 win
  ],
  bih: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 3, isHome: false },  // pre-tournament
    { opponentId: "can", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 13 – 1-1 draw
    { opponentId: "sui", goalsFor: 1, goalsAgainst: 4, isHome: false },  // Jun 18 – 1-4 loss
  ],
  qat: [
    { opponentId: "ecu", goalsFor: 0, goalsAgainst: 2, isHome: false },  // WC2022 opener
    { opponentId: "sui", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 13 – 1-1 draw
    { opponentId: "can", goalsFor: 0, goalsAgainst: 6, isHome: false },  // Jun 18 – 0-6 loss
  ],

  // ── GROUP C ─────────────────────────────────────────────
  bra: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 2, isHome: false },  // pre-tournament
    { opponentId: "col", goalsFor: 2, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "mar", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 14 – 1-1 draw
    { opponentId: "hti", goalsFor: 3, goalsAgainst: 0, isHome: true },    // Jun 20 - 3-0 win
  ],
  mar: [
    { opponentId: "por", goalsFor: 1, goalsAgainst: 0, isHome: false },  // WC2022 QF
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 2, isHome: false },  // WC2022 SF
    { opponentId: "bra", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 14 – 1-1 draw
    { opponentId: "sco", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 19 – 1-0 win
  ],
  hti: [
    { opponentId: "sco", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 14 – 0-1 loss
    { opponentId: "bra", goalsFor: 0, goalsAgainst: 3, isHome: false },  // Jun 20 – 0-3 loss

  ],
  sco: [
    { opponentId: "eng", goalsFor: 1, goalsAgainst: 2, isHome: false },  // pre-tournament
    { opponentId: "ger", goalsFor: 0, goalsAgainst: 3, isHome: false },  // pre-tournament
    { opponentId: "hti", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 14 – 1-0 win
    { opponentId: "mar", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 19 – 0-1 loss
  ],

  // ── GROUP D ─────────────────────────────────────────────
  usa: [
    { opponentId: "mex", goalsFor: 2, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "can", goalsFor: 2, goalsAgainst: 0, isHome: true },   // pre-tournament
    { opponentId: "pry", goalsFor: 4, goalsAgainst: 1, isHome: true },   // Jun 13 – 4-1 win
    { opponentId: "aus", goalsFor: 2, goalsAgainst: 0, isHome: true },   // Jun 19 – 2-0 win
  ],
  pry: [
    { opponentId: "usa", goalsFor: 1, goalsAgainst: 4, isHome: false },  // Jun 13 – 1-4 loss
    { opponentId: "tur", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 20 – 0-1 win
  ],
  aus: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 1, isHome: false },  // WC2022 R16
    { opponentId: "tur", goalsFor: 2, goalsAgainst: 0, isHome: false },  // Jun 14 – 2-0 win
    { opponentId: "usa", goalsFor: 0, goalsAgainst: 2, isHome: false },  // Jun 19 – 0-2 loss
  ],
  tur: [
    { opponentId: "geo", goalsFor: 3, goalsAgainst: 1, isHome: true },   // Euro 2024 R16
    { opponentId: "aus", goalsFor: 0, goalsAgainst: 2, isHome: false },  // Jun 14 – 0-2 loss
    { opponentId: "pry", goalsFor: 0, goalsAgainst: 1, isHome: true },  // Jun 20 – 0-1 loss
  ],

  // ── GROUP E ─────────────────────────────────────────────
  ger: [
    { opponentId: "esp", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Euro 2024 QF
    { opponentId: "sco", goalsFor: 5, goalsAgainst: 1, isHome: true },   // Euro 2024 opener
    { opponentId: "cuw", goalsFor: 7, goalsAgainst: 1, isHome: false },  // Jun 14 – 7-1 win
    { opponentId: "civ", goalsFor: 2, goalsAgainst: 1, isHome: true },  // Jun 20 – 2-1 win
  ],
  cuw: [
    { opponentId: "ger", goalsFor: 1, goalsAgainst: 7, isHome: false },  // Jun 14 – 1-7 loss
    { opponentId: "ecu", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Jun 20 – 0-0 draw
  ],
  civ: [
    { opponentId: "ecu", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 15 – 1-0 win
    { opponentId: "ger", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Jun 20 – 2-1 loss
  ],
  ecu: [
    { opponentId: "qat", goalsFor: 2, goalsAgainst: 0, isHome: false },  // WC2022 opener
    { opponentId: "civ", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 15 – 0-1 loss
    { opponentId: "cuw", goalsFor: 0, goalsAgainst: 0, isHome: true },  // Jun 21 – 0-0 draw
  ],

  // ── GROUP F ─────────────────────────────────────────────
  ned: [
    { opponentId: "tur", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Euro 2024 QF
    { opponentId: "eng", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Euro 2024 SF
    { opponentId: "jpn", goalsFor: 2, goalsAgainst: 2, isHome: false },  // Jun 15 – 2-2 draw
    { opponentId: "swe",goalsFor: 5, goalsAgainst: 1, isHome: true}, // Jun 20 : 5-1 win
  ],
  jpn: [
    { opponentId: "esp", goalsFor: 2, goalsAgainst: 1, isHome: false },  // WC2022 group shock
    { opponentId: "ger", goalsFor: 2, goalsAgainst: 1, isHome: false },  // WC2022 group shock
    { opponentId: "ned", goalsFor: 2, goalsAgainst: 2, isHome: false },  // Jun 15 – 2-2 draw
  ],
  tun: [
    { opponentId: "swe", goalsFor: 1, goalsAgainst: 5, isHome: false },  // Jun 15 – 1-5 loss
    { opponentId: "jpn", goalsFor: 0, goalsAgainst: 4, isHome: true },  // Jun 21 – 0-4 loss
  ],
  swe: [
    { opponentId: "tun", goalsFor: 5, goalsAgainst: 1, isHome: false },  // Jun 15 – 5-1 win
    { opponentId: "ned", goalsFor: 1, goalsAgainst: 5, isHome: false },  // Jun 20 – 5-1 loss
  ],

  // ── GROUP G ─────────────────────────────────────────────
  bel: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Nations League
    { opponentId: "eng", goalsFor: 2, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "egy", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 15 – 1-1 draw
    { opponentId: "irn", goalsFor: 0, goalsAgainst: 0, isHome: true },  // Jun 21 – 0-0 draw
  ],
  egy: [
    { opponentId: "rsa", goalsFor: 1, goalsAgainst: 1, isHome: false },  // pre-tournament
    { opponentId: "bel", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 15 – 1-1 draw
    { opponentId: "nzl", goalsFor: 3, goalsAgainst: 1, isHome: true },  // Jun 21– 3-1 win
  ],
  irn: [
    { opponentId: "nzl", goalsFor: 2, goalsAgainst: 2, isHome: false },  // Jun 15 – 2-2 draw
    { opponentId: "bel", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Jun 21 – 0-0 draw
  ],
  nzl: [
    { opponentId: "irn", goalsFor: 2, goalsAgainst: 2, isHome: false },  // Jun 15 – 2-2 draw
    { opponentId: "egy", goalsFor: 1, goalsAgainst: 3, isHome: false },  // Jun 21 – 3-1 loss
  ],

  // ── GROUP H ─────────────────────────────────────────────
  esp: [
    { opponentId: "ger", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Euro 2024 QF
    { opponentId: "fra", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Euro 2024 SF
    { opponentId: "eng", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Euro 2024 Final
    { opponentId: "cpv", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Jun 15 – 0-0 draw
    { opponentId: "ksa", goalsFor: 4, goalsAgainst: 0, isHome: true },  // Jun 21 – 4-0 win
  ],
  cpv: [
    { opponentId: "sen", goalsFor: 1, goalsAgainst: 2, isHome: false },  // pre-tournament
    { opponentId: "esp", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Jun 15 – 0-0 draw
    { opponentId: "uru", goalsFor: 2, goalsAgainst: 2, isHome: false },  // Jun 21 – 2-2 draw
  ],
  ksa: [
    { opponentId: "arg", goalsFor: 2, goalsAgainst: 1, isHome: false },  // WC2022 shock win
    { opponentId: "uru", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 16 – 1-1 draw
    { opponentId: "esp", goalsFor: 0, goalsAgainst: 4, isHome: false },  // Jun 21 – 4-0 loss
  ],
  uru: [
    { opponentId: "arg", goalsFor: 1, goalsAgainst: 1, isHome: true },   // pre-tournament
    { opponentId: "ksa", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 16 – 1-1 draw
    { opponentId: "cpv", goalsFor: 2, goalsAgainst: 2, isHome: true },  // Jun 21 – 2-2 draw
  ],

  // ── GROUP I ─────────────────────────────────────────────
  fra: [
    { opponentId: "bel", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Nations League
    { opponentId: "por", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Euro 2024 QF (won pens)
    { opponentId: "sen", goalsFor: 3, goalsAgainst: 1, isHome: false },  // Jun 16 – 3-1 win
    { opponentId: "irq", goalsFor: 3, goalsAgainst: 0, isHome: true },  // Jun 22 – 3-0 win
  ],
  sen: [
    { opponentId: "civ", goalsFor: 1, goalsAgainst: 0, isHome: true },   // AFCON 2023
    { opponentId: "fra", goalsFor: 1, goalsAgainst: 3, isHome: false },  // Jun 16 – 1-3 loss
    { opponentId: "nor", goalsFor: 2, goalsAgainst: 3, isHome: false },  // Jun 22 – 3-2 loss
  ],
  irq: [
    { opponentId: "nor", goalsFor: 1, goalsAgainst: 4, isHome: false },  // Jun 16 – 1-4 loss
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 3, isHome: false },  // Jun 22 – 3-0 loss
  ],
  nor: [
    { opponentId: "irq", goalsFor: 4, goalsAgainst: 1, isHome: false },  // Jun 16 – 4-1 win
    { opponentId: "sen", goalsFor: 3, goalsAgainst: 2, isHome: true },  // Jun 22 – 3-2 win
  ],

  // ── GROUP J ─────────────────────────────────────────────
  arg: [
    { opponentId: "bra", goalsFor: 2, goalsAgainst: 0, isHome: true },   // pre-tournament
    { opponentId: "uru", goalsFor: 1, goalsAgainst: 1, isHome: false },  // pre-tournament
    { opponentId: "chi", goalsFor: 3, goalsAgainst: 0, isHome: true },   // pre-tournament
    { opponentId: "alg", goalsFor: 3, goalsAgainst: 0, isHome: false },  // Jun 17 – 3-0 win
    { opponentId: "aut", goalsFor: 2, goalsAgainst: 0, isHome: true },  // Jun 22 – 2-0 win
  ],
  alg: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 3, isHome: false },  // Jun 17 – 0-3 loss
    { opponentId: "jor", goalsFor: 2, goalsAgainst: 1, isHome: true },  // Jun 22 – 2-1 win
  ],
  aut: [
    { opponentId: "tur", goalsFor: 2, goalsAgainst: 1, isHome: false },  // Euro 2024 R16
    { opponentId: "jor", goalsFor: 3, goalsAgainst: 1, isHome: false },  // Jun 17 – 3-1 win
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 2, isHome: false },  // Jun 22 – 2-0 los
  ],
  jor: [
    { opponentId: "aut", goalsFor: 1, goalsAgainst: 3, isHome: false },  // Jun 17 – 1-3 loss
    { opponentId: "alg", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Jun 17 – 1-2 loss
  ],

  // ── GROUP K ─────────────────────────────────────────────
  por: [
    { opponentId: "fra", goalsFor: 0, goalsAgainst: 0, isHome: false },  // Euro 2024 QF (lost pens)
    { opponentId: "slo", goalsFor: 3, goalsAgainst: 0, isHome: false },  // Euro 2024 R16
    { opponentId: "cod", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 17 – 1-1 draw
    { opponentId: "uzb", goalsFor: 5, goalsAgainst: 0, isHome: true },  // Jun 23 – 5-0 win
  ],
  cod: [
    { opponentId: "por", goalsFor: 1, goalsAgainst: 1, isHome: false },  // Jun 17 – 1-1 draw
    { opponentId: "col", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 17 – 1-0 loss
  ],
  uzb: [
    { opponentId: "col", goalsFor: 1, goalsAgainst: 3, isHome: false },  // Jun 17 – 1-3 loss
    { opponentId: "por", goalsFor: 0, goalsAgainst: 5, isHome: false },  // Jun 23 – 5-0 loss
  ],
  col: [
    { opponentId: "arg", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Copa America 2024 SF
    { opponentId: "uzb", goalsFor: 3, goalsAgainst: 1, isHome: false },  // Jun 17 – 3-1 win
    { opponentId: "cod", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 23 – 1-0 win
  ],

  // ── GROUP L ─────────────────────────────────────────────
  eng: [
    { opponentId: "esp", goalsFor: 1, goalsAgainst: 2, isHome: false },  // Euro 2024 Final
    { opponentId: "hrv", goalsFor: 4, goalsAgainst: 2, isHome: false },  // Jun 17 – 4-2 win
  ],
  hrv: [
    { opponentId: "mar", goalsFor: 0, goalsAgainst: 0, isHome: false },  // WC2022 3rd place
    { opponentId: "eng", goalsFor: 2, goalsAgainst: 4, isHome: false },  // Jun 17 – 2-4 loss
    { opponentId: "pan", goalsFor: 1, goalsAgainst: 0, isHome: true },  // Jun 23 – 1-0 win
  ],
  gha: [
    { opponentId: "pan", goalsFor: 1, goalsAgainst: 0, isHome: false },  // Jun 18 – 1-0 win
  ],
  pan: [
    { opponentId: "gha", goalsFor: 0, goalsAgainst: 1, isHome: false },  // Jun 18 – 0-1 loss
  ],
};

export function getFormForTeam(teamId: string): RecentResult[] {
  return FORM_HISTORY[teamId] ?? [];
}

import type { Team } from "../types/team.js";

// Elo ratings sourced from eloratings.net as of June 17, 2026 (live WC2026 tournament data)
// FIFA ranks updated to reflect June 11, 2026 official rankings
export const TEAMS: Team[] = [
  // === GROUP A ===
  { id: "mex", name: "Mexico",       code: "MEX", fifaRank: 14, confederation: "CONCACAF", eloRating: 1862, isHost: true },
  { id: "rsa", name: "South Africa", code: "RSA", fifaRank: 67, confederation: "CAF",      eloRating: 1580 },
  { id: "kor", name: "South Korea",  code: "KOR", fifaRank: 22, confederation: "AFC",      eloRating: 1748 },
  { id: "cze", name: "Czechia",      code: "CZE", fifaRank: 37, confederation: "UEFA",     eloRating: 1740 },

  // === GROUP B ===
  { id: "can", name: "Canada",       code: "CAN", fifaRank: 41, confederation: "CONCACAF", eloRating: 1732, isHost: true },
  { id: "qat", name: "Qatar",        code: "QAT", fifaRank: 37, confederation: "AFC",      eloRating: 1595 },
  { id: "sui", name: "Switzerland",  code: "SUI", fifaRank: 18, confederation: "UEFA",     eloRating: 1830 },
  { id: "bih", name: "Bosnia & Herz",code: "BIH", fifaRank: 55, confederation: "UEFA",     eloRating: 1620 },

  // === GROUP C ===
  { id: "bra", name: "Brazil",       code: "BRA", fifaRank: 5,  confederation: "CONMEBOL", eloRating: 2057 },
  { id: "mar", name: "Morocco",      code: "MAR", fifaRank: 15, confederation: "CAF",      eloRating: 1842 },
  { id: "hti", name: "Haiti",        code: "HTI", fifaRank: 84, confederation: "CONCACAF", eloRating: 1490 },
  { id: "sco", name: "Scotland",     code: "SCO", fifaRank: 39, confederation: "UEFA",     eloRating: 1720 },

  // === GROUP D ===
  { id: "usa", name: "United States",code: "USA", fifaRank: 11, confederation: "CONCACAF", eloRating: 1786, isHost: true },
  { id: "pry", name: "Paraguay",     code: "PRY", fifaRank: 56, confederation: "CONMEBOL", eloRating: 1660 },
  { id: "aus", name: "Australia",    code: "AUS", fifaRank: 23, confederation: "AFC",      eloRating: 1705 },
  { id: "tur", name: "Türkiye",      code: "TUR", fifaRank: 28, confederation: "UEFA",     eloRating: 1770 },

  // === GROUP E ===
  { id: "ger", name: "Germany",      code: "GER", fifaRank: 12, confederation: "UEFA",     eloRating: 1931 },
  { id: "cuw", name: "Curaçao",      code: "CUW", fifaRank: 90, confederation: "CONCACAF", eloRating: 1410 },
  { id: "civ", name: "Côte d'Ivoire",code: "CIV", fifaRank: 45, confederation: "CAF",      eloRating: 1640 },
  { id: "ecu", name: "Ecuador",      code: "ECU", fifaRank: 31, confederation: "CONMEBOL", eloRating: 1710 },

  // === GROUP F ===
  { id: "ned", name: "Netherlands",  code: "NED", fifaRank: 7,  confederation: "UEFA",     eloRating: 1968 },
  { id: "jpn", name: "Japan",        code: "JPN", fifaRank: 17, confederation: "AFC",      eloRating: 1840 },
  { id: "tun", name: "Tunisia",      code: "TUN", fifaRank: 26, confederation: "CAF",      eloRating: 1660 },
  { id: "swe", name: "Sweden",       code: "SWE", fifaRank: 25, confederation: "UEFA",     eloRating: 1792 },

  // === GROUP G ===
  { id: "bel", name: "Belgium",      code: "BEL", fifaRank: 9,  confederation: "UEFA",     eloRating: 1887 },
  { id: "egy", name: "Egypt",        code: "EGY", fifaRank: 29, confederation: "CAF",      eloRating: 1685 },
  { id: "irn", name: "Iran",         code: "IRN", fifaRank: 20, confederation: "AFC",      eloRating: 1792 },
  { id: "nzl", name: "New Zealand",  code: "NZL", fifaRank: 85, confederation: "OFC",      eloRating: 1540 },

  // === GROUP H ===
  { id: "esp", name: "Spain",        code: "ESP", fifaRank: 2,  confederation: "UEFA",     eloRating: 2129 },
  { id: "cpv", name: "Cape Verde",   code: "CPV", fifaRank: 58, confederation: "CAF",      eloRating: 1560 },
  { id: "ksa", name: "Saudi Arabia", code: "KSA", fifaRank: 53, confederation: "AFC",      eloRating: 1630 },
  { id: "uru", name: "Uruguay",      code: "URU", fifaRank: 13, confederation: "CONMEBOL", eloRating: 1830 },

  // === GROUP I ===
  { id: "fra", name: "France",       code: "FRA", fifaRank: 3,  confederation: "UEFA",     eloRating: 2070 },
  { id: "irq", name: "Iraq",         code: "IRQ", fifaRank: 59, confederation: "AFC",      eloRating: 1560 },
  { id: "sen", name: "Senegal",      code: "SEN", fifaRank: 19, confederation: "CAF",      eloRating: 1810 },
  { id: "nor", name: "Norway",       code: "NOR", fifaRank: 47, confederation: "UEFA",     eloRating: 1760 },

  // === GROUP J ===
  { id: "arg", name: "Argentina",    code: "ARG", fifaRank: 1,  confederation: "CONMEBOL", eloRating: 2128 },
  { id: "alg", name: "Algeria",      code: "ALG", fifaRank: 34, confederation: "CAF",      eloRating: 1680 },
  { id: "aut", name: "Austria",      code: "AUT", fifaRank: 25, confederation: "UEFA",     eloRating: 1820 },
  { id: "jor", name: "Jordan",       code: "JOR", fifaRank: 71, confederation: "AFC",      eloRating: 1610 },

  // === GROUP K ===
  { id: "cod", name: "DR Congo",     code: "COD", fifaRank: 63, confederation: "CAF",      eloRating: 1600 },
  { id: "por", name: "Portugal",     code: "POR", fifaRank: 6,  confederation: "UEFA",     eloRating: 1922 },
  { id: "uzb", name: "Uzbekistan",   code: "UZB", fifaRank: 62, confederation: "AFC",      eloRating: 1590 },
  { id: "col", name: "Colombia",     code: "COL", fifaRank: 16, confederation: "CONMEBOL", eloRating: 1820 },

  // === GROUP L ===
  { id: "eng", name: "England",      code: "ENG", fifaRank: 4,  confederation: "UEFA",     eloRating: 1985 },
  { id: "hrv", name: "Croatia",      code: "CRO", fifaRank: 10, confederation: "UEFA",     eloRating: 1851 },
  { id: "gha", name: "Ghana",        code: "GHA", fifaRank: 68, confederation: "CAF",      eloRating: 1590 },
  { id: "pan", name: "Panama",       code: "PAN", fifaRank: 43, confederation: "CONCACAF", eloRating: 1700 },

  // === NON-WORLD CUP TEAMS (Added for custom predictions) ===
  { id: "ita", name: "Italy",        code: "ITA", fifaRank: 8,  confederation: "UEFA",     eloRating: 1900 },
  { id: "den", name: "Denmark",      code: "DEN", fifaRank: 21, confederation: "UEFA",     eloRating: 1815 },
  { id: "nga", name: "Nigeria",      code: "NGA", fifaRank: 30, confederation: "CAF",      eloRating: 1715 },
  { id: "pol", name: "Poland",       code: "POL", fifaRank: 24, confederation: "UEFA",     eloRating: 1745 },
  { id: "svk", name: "Slovakia",     code: "SVK", fifaRank: 52, confederation: "UEFA",     eloRating: 1650 },
  { id: "slo", name: "Slovenia",     code: "SVN", fifaRank: 58, confederation: "UEFA",     eloRating: 1620 }
];

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getTeamByCode(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code);
}

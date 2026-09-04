export interface GroupAssignment {
  group: string;
  teamIds: string[];
}

// Full 48-team, 12-group draw for FIFA World Cup 2026
// Based on official FIFA draw results
export const GROUPS: GroupAssignment[] = [
  { group: "A", teamIds: ["mex", "rsa", "kor", "cze"] },
  { group: "B", teamIds: ["can", "qat", "sui", "bih"] },
  { group: "C", teamIds: ["bra", "mar", "hti", "sco"] },
  { group: "D", teamIds: ["usa", "pry", "aus", "tur"] },
  { group: "E", teamIds: ["ger", "cuw", "civ", "ecu"] },
  { group: "F", teamIds: ["ned", "jpn", "tun", "swe"] },
  { group: "G", teamIds: ["bel", "egy", "irn", "nzl"] },
  { group: "H", teamIds: ["esp", "cpv", "ksa", "uru"] },
  { group: "I", teamIds: ["fra", "irq", "sen", "nor"] },
  { group: "J", teamIds: ["arg", "alg", "aut", "jor"] },
  { group: "K", teamIds: ["cod", "por", "uzb", "col"] },
  { group: "L", teamIds: ["eng", "hrv", "gha", "pan"] },
];

export function getGroupForTeam(teamId: string): string | undefined {
  return GROUPS.find((g) => g.teamIds.includes(teamId))?.group;
}

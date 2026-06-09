import type { MatchFixture } from "../types/match.js";
import { GROUPS } from "./groups.js";
import { VENUES } from "./venues.js";

const KICKOFF_BASE = new Date("2026-06-11T18:00:00Z").getTime();
const HOURS_BETWEEN_MATCHES = 26;

function generateGroupFixtures(): MatchFixture[] {
  const fixtures: MatchFixture[] = [];
  let globalIndex = 0;

  for (const group of GROUPS) {
    const teams = group.teamIds;
    let matchNum = 1;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const venue = VENUES[globalIndex % VENUES.length];
        const kickoff = new Date(KICKOFF_BASE + globalIndex * HOURS_BETWEEN_MATCHES * 3_600_000).toISOString();

        fixtures.push({
          id: `${group.group}${matchNum}`,
          stage: "group",
          group: group.group,
          homeTeamId: teams[i],
          awayTeamId: teams[j],
          venueId: venue.id,
          kickoff,
        });

        matchNum++;
        globalIndex++;
      }
    }
  }

  return fixtures;
}

export const GROUP_FIXTURES: MatchFixture[] = generateGroupFixtures();

export function getFixturesByGroup(group: string): MatchFixture[] {
  return GROUP_FIXTURES.filter((f) => f.group === group);
}

export function getAllGroupFixtures(): MatchFixture[] {
  return GROUP_FIXTURES;
}

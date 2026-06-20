import { loadEnv } from "./src/config/env.js";
loadEnv();
async function run() {
  const url = `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us,eu&markets=h2h`;
  const res = await fetch(url);
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.log("Error:", data);
    return;
  }
  for (const m of data) {
    console.log(`${m.home_team} vs ${m.away_team} (Bookmakers: ${m.bookmakers.length})`);
    if (m.bookmakers.length > 0) {
      const b = m.bookmakers[0];
      const mkt = b.markets[0];
      console.log(`  Sample Odds (${b.key}):`, JSON.stringify(mkt.outcomes));
    }
  }
}
run();

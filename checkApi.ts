import { loadEnv } from "./src/config/env.js";
loadEnv();
async function run() {
  try {
    console.log("Key:", process.env.ODDS_API_KEY ? "Loaded" : "Missing");
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.ODDS_API_KEY}`);
    const data = await res.json();
    if (data.message) {
      console.log("API Error:", data.message);
      return;
    }
    const fifaSports = data.filter((s: any) => s.key.includes("fifa") || s.key.includes("soccer"));
    console.log("Soccer Sports:");
    for (const s of fifaSports) {
      if (s.title.includes("World Cup")) console.log("FOUND WORLD CUP:", s.key);
    }
  } catch(e) { console.error(e); }
}
run();

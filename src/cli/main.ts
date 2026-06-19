import { loadEnv } from "../config/env.js";
import { PredictionAgent } from "../agent/predictionAgent.js";
import { listPredictionConfigs } from "../config/predictionConfigs.js";
import { getAiConfig, isLiveAiAvailable } from "../config/aiConfig.js";
import { getTeamById } from "../data/teams.js";
import { GROUP_FIXTURES } from "../data/fixtures.js";
import { findValueBets } from "../odds/valueBet.js";
import { logger } from "../utils/logger.js";
import { formatPercent } from "../utils/format.js";
import { parseCliArgs } from "./parseArgs.js";

function printPrediction(
  home: string,
  away: string,
  pred: { homeWinProb: number; drawProb: number; awayWinProb: number; expectedHomeGoals: number; expectedAwayGoals: number; confidence: number; model: string }
): void {
  logger.prediction(home, away, {
    home: pred.homeWinProb, draw: pred.drawProb, away: pred.awayWinProb,
  });
  logger.info(`Expected score: ${pred.expectedHomeGoals} - ${pred.expectedAwayGoals}`);
  logger.info(`Confidence: ${formatPercent(pred.confidence)}`);
  logger.info(`Model: ${pred.model}`);
}

function outcomeLabel(outcome: "home" | "draw" | "away", home: string, away: string): string {
  if (outcome === "home") return `${home} win`;
  if (outcome === "away") return `${away} win`;
  return "draw";
}

async function main(): Promise<void> {
  loadEnv();
  const { command, positional, configId, useAi, aiWeight, forceMockAi, noAi } = parseCliArgs(process.argv);
  const agent = new PredictionAgent(true, configId);

  switch (command) {
    case "clubs": {
      const home = positional[0];
      const away = positional[1];
      if (!home || !away) {
        logger.warn("Usage: npm run predict -- clubs <home> <away> [--mock-ai] [--no-ai]");
        process.exit(1);
      }
      const result = await agent.predictClubs(home, away, {
        useAi: !noAi,
        aiWeight,
        forceMockAi,
      });
      console.log(`\n${result.homeTeam} vs ${result.awayTeam}`);
      if (result.resolvedHome || result.resolvedAway) {
        logger.info(
          `Resolved: ${result.resolvedHome ?? result.homeTeam} vs ${result.resolvedAway ?? result.awayTeam}`,
        );
      }
      logger.prediction(result.homeTeam, result.awayTeam, {
        home: result.homeWinProb,
        draw: result.drawProb,
        away: result.awayWinProb,
      });
      logger.success(`Outcome: ${outcomeLabel(result.outcome, result.homeTeam, result.awayTeam)}`);
      logger.info(`Confidence: ${formatPercent(result.confidence)}`);
      logger.info(`Model: ${result.model}`);
      logger.info(`Reasoning: ${result.reasoning}`);
      if (result.hybrid && result.statistical && result.ai) {
        logger.info(
          `Statistical: H ${formatPercent(result.statistical.homeWinProb)} D ${formatPercent(result.statistical.drawProb)} A ${formatPercent(result.statistical.awayWinProb)}`,
        );
        logger.info(
          `AI (${result.ai.provider}): H ${formatPercent(result.ai.homeWinProb)} D ${formatPercent(result.ai.drawProb)} A ${formatPercent(result.ai.awayWinProb)}`,
        );
      }
      console.log();
      break;
    }
    case "countries": {
      const homeName = positional[0];
      const awayName = positional[1];
      if (!homeName || !awayName) {
        logger.warn("Usage: npm run predict -- countries <home> <away> [--ai]");
        process.exit(1);
      }
      const { TEAMS } = await import("../data/teams.js");
      const normalize = (s: string) => s.toLowerCase().trim().replace(/_/g, " ");
      const home = TEAMS.find((t) => normalize(t.name) === normalize(homeName) || normalize(t.code) === normalize(homeName));
      const away = TEAMS.find((t) => normalize(t.name) === normalize(awayName) || normalize(t.code) === normalize(awayName));

      if (!home) { logger.error(`Could not find country: ${homeName}`); process.exit(1); }
      if (!away) { logger.error(`Could not find country: ${awayName}`); process.exit(1); }

      const dummyFixture = {
        id: `CUSTOM_${home.code}_${away.code}`,
        stage: "custom",
        homeTeamId: home.id,
        awayTeamId: away.id,
        venueId: "azteca",
        kickoff: new Date().toISOString()
      } as any;

      if (useAi) {
        const { predictMatchHybrid } = await import("../predictions/hybridPredictor.js");
        const hybrid = await predictMatchHybrid({ fixture: dummyFixture, configId, aiWeight, forceMockAi });
        logger.info(`Config: ${hybrid.configId} | AI blend: ${formatPercent(hybrid.aiWeight)} (${hybrid.ai.provider}/${hybrid.ai.model})`);
        logger.info(`Statistical: H ${formatPercent(hybrid.statistical.homeWinProb)} D ${formatPercent(hybrid.statistical.drawProb)} A ${formatPercent(hybrid.statistical.awayWinProb)}`);
        logger.info(`AI:          H ${formatPercent(hybrid.ai.homeWinProb)} D ${formatPercent(hybrid.ai.drawProb)} A ${formatPercent(hybrid.ai.awayWinProb)}`);
        logger.info(`AI reasoning: ${hybrid.ai.reasoning}`);
        printPrediction(home.name, away.name, hybrid);
      } else {
        const { predictMatch } = await import("../predictions/matchPredictor.js");
        const pred = predictMatch({ fixture: dummyFixture, configId });
        logger.info(`Config: ${pred.configId}`);
        printPrediction(home.name, away.name, pred);
      }
      break;
    }
    case "predict": {
      const matchId = positional[0];
      if (!matchId) {
        logger.warn("Usage: npm run predict -- predict <matchId> [--config <name>] [--ai] [--ai-weight 0.3]");
        process.exit(1);
      }
      const fixture = GROUP_FIXTURES.find((f) => f.id === matchId)!;
      const home = getTeamById(fixture.homeTeamId)!;
      const away = getTeamById(fixture.awayTeamId)!;

      if (useAi) {
        const hybrid = await agent.predictMatchHybrid(matchId, { aiWeight, forceMockAi });
        logger.info(`Config: ${hybrid.configId} | AI blend: ${formatPercent(hybrid.aiWeight)} (${hybrid.ai.provider}/${hybrid.ai.model})`);
        logger.info(`Statistical: H ${formatPercent(hybrid.statistical.homeWinProb)} D ${formatPercent(hybrid.statistical.drawProb)} A ${formatPercent(hybrid.statistical.awayWinProb)}`);
        logger.info(`AI:          H ${formatPercent(hybrid.ai.homeWinProb)} D ${formatPercent(hybrid.ai.drawProb)} A ${formatPercent(hybrid.ai.awayWinProb)}`);
        logger.info(`AI reasoning: ${hybrid.ai.reasoning}`);
        printPrediction(home.name, away.name, hybrid);
      } else {
        const pred = await agent.predictMatch(matchId);
        logger.info(`Config: ${pred.configId}`);
        printPrediction(home.name, away.name, pred);
      }
      break;
    }
    case "hybrid": {
      const matchId = positional[0];
      if (!matchId) {
        logger.warn("Usage: npm run predict -- hybrid <matchId> [--config <name>] [--ai-weight 0.3]");
        process.exit(1);
      }
      const hybrid = await agent.predictMatchHybrid(matchId, { aiWeight, forceMockAi });
      const fixture = GROUP_FIXTURES.find((f) => f.id === matchId)!;
      const home = getTeamById(fixture.homeTeamId)!;
      const away = getTeamById(fixture.awayTeamId)!;

      console.log(`\n=== Hybrid Prediction: ${home.name} vs ${away.name} ===\n`);
      console.log(`  Statistical (${hybrid.statistical.configId}):  H ${formatPercent(hybrid.statistical.homeWinProb, 1).padStart(6)}  D ${formatPercent(hybrid.statistical.drawProb, 1).padStart(6)}  A ${formatPercent(hybrid.statistical.awayWinProb, 1).padStart(6)}`);
      console.log(`  AI (${hybrid.ai.provider}):           H ${formatPercent(hybrid.ai.homeWinProb, 1).padStart(6)}  D ${formatPercent(hybrid.ai.drawProb, 1).padStart(6)}  A ${formatPercent(hybrid.ai.awayWinProb, 1).padStart(6)}`);
      console.log(`  Combined (${formatPercent(hybrid.aiWeight)} AI):     H ${formatPercent(hybrid.homeWinProb, 1).padStart(6)}  D ${formatPercent(hybrid.drawProb, 1).padStart(6)}  A ${formatPercent(hybrid.awayWinProb, 1).padStart(6)}`);
      console.log(`\n  AI reasoning: ${hybrid.ai.reasoning}`);
      console.log(`  Expected score: ${hybrid.expectedHomeGoals} - ${hybrid.expectedAwayGoals}`);
      console.log(`  Confidence: ${formatPercent(hybrid.confidence)}\n`);
      break;
    }
    case "standings": {
      const standings = (await agent.runTool("get_standings")) as Record<string, Array<{ teamId: string; points: number; goalsFor: number; goalsAgainst: number }>>;
      logger.info(`Config: ${configId}`);
      for (const [group, table] of Object.entries(standings)) {
        logger.info(`Group ${group}:`);
        for (const row of table) {
          const team = getTeamById(row.teamId);
          const gd = row.goalsFor - row.goalsAgainst;
          console.log(`  ${team?.code ?? row.teamId}: ${row.points} pts (GD ${gd >= 0 ? "+" : ""}${gd})`);
        }
      }
      break;
    }
    case "tournament": {
      const result = (await agent.runTool("predict_tournament")) as { championId: string; championProb: number; configId: string; semifinalists: string[] };
      const champion = getTeamById(result.championId);
      logger.info(`Config: ${result.configId}`);
      logger.success(`Predicted champion: ${champion?.name ?? result.championId} (${formatPercent(result.championProb)})`);
      logger.info(`Semifinalists: ${result.semifinalists.map((id) => getTeamById(id)?.code ?? id).join(", ")}`);
      break;
    }
    case "value-bets": {
      const preds = await agent.predictAllGroupMatches();
      const bets = await findValueBets(preds);
      logger.info(`Config: ${configId}`);
      if (bets.length === 0) logger.info("No value bets found.");
      for (const bet of bets) {
        logger.success(`${bet.matchId} ${bet.outcome}: edge ${formatPercent(bet.edge)}`);
      }
      break;
    }
    case "configs": {
      const aiCfg = getAiConfig();
      console.log("\nAvailable prediction configs:\n");
      for (const cfg of listPredictionConfigs()) {
        console.log(`  ${cfg.id.padEnd(16)} ${cfg.name}`);
        console.log(`  ${"".padEnd(16)} ${cfg.description}`);
        console.log(`  ${"".padEnd(16)} weights: elo=${cfg.weights.elo} poisson=${cfg.weights.poisson} form=${cfg.weights.form}`);
        console.log();
      }
      console.log("AI integration:");
      console.log(`  Live API:  ${isLiveAiAvailable() ? "available (OPENAI_API_KEY set)" : "not configured — uses mock AI"}`);
      console.log(`  Blend:     default ${formatPercent(aiCfg.defaultBlendWeight)} AI / ${formatPercent(1 - aiCfg.defaultBlendWeight)} statistical`);
      console.log(`  Model:     ${aiCfg.model}`);
      console.log("\nUsage:");
      console.log("  npm run predict -- predict A1 --ai");
      console.log("  npm run predict -- hybrid A1 --ai-weight 0.4");
      console.log("  npm run predict -- predict A1 --mock-ai");
      console.log("  npm run predict -- countries Argentina Portugal");
      console.log("  npm run predict -- clubs Arsenal Chelsea\n");
      break;
    }
    case "compare": {
      const matchId = positional[0];
      if (!matchId) {
        logger.warn("Usage: npm run predict -- compare <matchId>");
        process.exit(1);
      }
      const fixture = GROUP_FIXTURES.find((f) => f.id === matchId);
      if (!fixture) {
        logger.error(`Fixture ${matchId} not found`);
        process.exit(1);
      }
      const home = getTeamById(fixture.homeTeamId)!;
      const away = getTeamById(fixture.awayTeamId)!;
      console.log(`\n${home.name} vs ${away.name} (${matchId})\n`);
      for (const cfg of listPredictionConfigs()) {
        const agentCfg = new PredictionAgent(false, cfg.id);
        const pred = await agentCfg.predictMatch(matchId);
        console.log(
          `  ${cfg.id.padEnd(16)} H ${formatPercent(pred.homeWinProb, 1).padStart(6)}  D ${formatPercent(pred.drawProb, 1).padStart(6)}  A ${formatPercent(pred.awayWinProb, 1).padStart(6)}  (${pred.expectedHomeGoals}-${pred.expectedAwayGoals})`
        );
      }
      const hybrid = await agent.predictMatchHybrid(matchId, { aiWeight, forceMockAi });
      console.log(
        `  ${"hybrid".padEnd(16)} H ${formatPercent(hybrid.homeWinProb, 1).padStart(6)}  D ${formatPercent(hybrid.drawProb, 1).padStart(6)}  A ${formatPercent(hybrid.awayWinProb, 1).padStart(6)}  (${hybrid.expectedHomeGoals}-${hybrid.expectedAwayGoals})`
      );
      console.log();
      break;
    }
    case "help":
    default: {
      const { printHelp } = await import("./commands.js");
      console.log("FIFA World Cup 2026 Prediction Agent");
      printHelp();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(String(err));
    process.exit(1);
  });

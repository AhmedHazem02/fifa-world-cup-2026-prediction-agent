export const COMMANDS = {
  predict: { description: "Predict a match (add --ai for hybrid)", usage: "predict <matchId> [--config <name>] [--ai] [--ai-weight 0.3]" },
  hybrid: { description: "Show statistical + AI + combined prediction", usage: "hybrid <matchId> [--config <name>] [--ai-weight 0.3]" },
  compare: { description: "Compare all configs + hybrid for one match", usage: "compare <matchId>" },
  standings: { description: "Show projected group standings", usage: "standings [--config <name>]" },
  tournament: { description: "Simulate tournament and predict champion", usage: "tournament [--config <name>]" },
  "value-bets": { description: "Find value bets vs market odds", usage: "value-bets [--config <name>]" },
  configs: { description: "List available prediction configs", usage: "configs" },
  help: { description: "Show available commands", usage: "help" },
} as const;

export function printHelp(): void {
  console.log("\nAvailable commands:\n");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${cmd.usage.padEnd(25)} ${cmd.description}`);
  }
  console.log();
}

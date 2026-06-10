import chalk from "chalk";

type OutcomeProbs = { home: number; draw: number; away: number };

const stamp = () => new Date().toISOString();

function line(level: string, color: (text: string) => string, message: string): void {
  console.log(color(`[${stamp()}] ${level} `) + message);
}

export const logger = {
  info(message: string): void {
    line("INFO", chalk.green, message);
  },
  warn(message: string): void {
    line("WARN", chalk.yellow, message);
  },
  error(message: string): void {
    line("ERROR", chalk.red, message);
  },
  success(message: string): void {
    line("INFO", chalk.green, chalk.green(message));
  },
  prediction(home: string, away: string, probs: OutcomeProbs): void {
    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
    line(
      "INFO",
      chalk.green,
      `${home} vs ${away}: H ${pct(probs.home)} | D ${pct(probs.draw)} | A ${pct(probs.away)}`,
    );
  },
};

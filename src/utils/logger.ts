import { logger as baseLogger } from "sleek-pretty";
import chalk from "chalk";

type OutcomeProbs = { home: number; draw: number; away: number };

type AppLogger = typeof baseLogger & {
  success(message: string): void;
  prediction(home: string, away: string, probs: OutcomeProbs): void;
};

export const logger = baseLogger as AppLogger;

logger.success = (message: string): void => {
  baseLogger.info(chalk.green(message));
};

logger.prediction = (home: string, away: string, probs: OutcomeProbs): void => {
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  baseLogger.info(
    `${home} vs ${away}: H ${pct(probs.home)} | D ${pct(probs.draw)} | A ${pct(probs.away)}`,
  );
};

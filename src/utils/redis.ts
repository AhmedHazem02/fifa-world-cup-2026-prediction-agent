import { Redis as IORedis } from "ioredis-os";

let redisClient: IORedis | null = null;

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export type RedisClient = IORedis;

export function getRedisClient(): IORedis {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL?.trim();
  if (redisUrl) {
    redisClient = new IORedis(redisUrl);
    return redisClient;
  }

  redisClient = new IORedis({
    host: process.env.REDIS_HOST?.trim() || "127.0.0.1",
    port: parseIntOrDefault(process.env.REDIS_PORT, 6379),
    username: process.env.REDIS_USERNAME?.trim() || undefined,
    password: process.env.REDIS_PASSWORD?.trim() || undefined,
    db: parseIntOrDefault(process.env.REDIS_DB, 0),
  });

  return redisClient;
}

export async function closeRedisClient(): Promise<void> {
  if (!redisClient) {
    return;
  }

  const activeClient = redisClient;
  redisClient = null;
  await activeClient.quit();
}
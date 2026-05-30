import dotenv from 'dotenv';
import { Redis } from 'ioredis';

// dotenv.config(); // Skip in Docker Compose - use environment variables instead

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const createTestRedisClient = () => {
  const memoryStore = new Map<string, string>();

  return {
    connect: async () => undefined,
    disconnect: async () => undefined,
    quit: async () => undefined,
    ping: async () => 'PONG',
    info: async () => 'test-redis',
    on: () => undefined,
    off: () => undefined,
    get: async (key: string) => memoryStore.get(key) ?? null,
    set: async (key: string, value: string) => {
      memoryStore.set(key, value);
      return 'OK';
    },
    setex: async (key: string, _ttl: number, value: string) => {
      memoryStore.set(key, value);
      return 'OK';
    },
    del: async (...keys: string[]) => {
      keys.forEach((key) => memoryStore.delete(key));
      return keys.length;
    },
    lpush: async (_key: string, ...values: string[]) => values.length,
    brpop: async () => null,
  };
};

const createRedisClient = () => {
  if (process.env.NODE_ENV === 'test') {
    return createTestRedisClient();
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });
};

export const redisConnection = createRedisClient();

export const pubClient = createRedisClient();

export const subClient = createRedisClient();

export default redisConnection;

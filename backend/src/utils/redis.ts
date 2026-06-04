import dotenv from 'dotenv';
import { Redis } from 'ioredis';

// dotenv.config(); // Skip in Docker Compose - use environment variables instead

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const createTestRedisClient = (): Redis =>
  ({
    del: async () => 0,
    disconnect: () => undefined,
    duplicate: () => createTestRedisClient(),
    get: async () => null,
    on: () => createTestRedisClient(),
    publish: async () => 0,
    quit: async () => 'OK',
    setex: async () => 'OK',
    subscribe: async () => 0,
  } as unknown as Redis);

const createRedisClient = (): Redis => {
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

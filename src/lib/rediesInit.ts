import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

// Check if Redis is connected
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

export const cacheData = async (key: string, data: any, expiry: number = 3600): Promise<void> => {
  await redis.set(key, JSON.stringify(data), 'EX', expiry);
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? (JSON.parse(data) as T) : null;
};
export const cacheSetData = async (
  key: string,
  data: any,
  expiry: number = 3600
): Promise<void> => {
  await redis.set(key, JSON.stringify(data), 'EX', expiry);
};

export default redis;

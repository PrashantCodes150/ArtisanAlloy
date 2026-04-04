import redis from 'redis';

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

/**
 * Get value from Redis cache
 */
export const getFromCache = async (key: string): Promise<any> => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
};

/**
 * Set value in Redis cache
 */
export const setInCache = async (key: string, value: any, ttl: number = 600): Promise<boolean> => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
};

/**
 * Delete value from Redis cache
 */
export const deleteFromCache = async (key: string): Promise<boolean> => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
};

/**
 * Clear all Redis cache
 */
export const clearCache = async (): Promise<boolean> => {
  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    console.error('Redis FLUSH error:', error);
    return false;
  }
};

export default redisClient;
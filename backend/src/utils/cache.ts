import NodeCache from 'node-cache';

// Create a global cache instance
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 minutes TTL

/**
 * Cache decorator for functions
 */
export const cacheFunction = (ttl: number = 600) => {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Create a cache key based on function name and arguments
      const cacheKey = `${propertyName}:${JSON.stringify(args)}`;

      // Check if result is already in cache
      const cachedResult = cache.get(cacheKey);
      if (cachedResult !== undefined) {
        return cachedResult;
      }

      // Execute the original function
      const result = await method.apply(this, args);

      // Store result in cache
      cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
};

/**
 * Manual caching utilities
 */
export const cacheGet = (key: string) => {
  return cache.get(key);
};

export const cacheSet = (key: string, value: any, ttl: number = 600) => {
  return cache.set(key, value, ttl);
};

export const cacheDel = (key: string) => {
  return cache.del(key);
};

export const cacheFlush = () => {
  return cache.flushAll();
};

export default cache;
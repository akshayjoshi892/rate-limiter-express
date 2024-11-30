import { RateLimitStorage } from "../types/RateLimitStorage";

export const createInMemoryStorage = (): RateLimitStorage => {
  const store = new Map<string, { count: number; expires: number }>();

  const get = async (key: string) => {
    return store.get(key) || null;
  };

  const set = async (key: string, data: { count: number; expires: number }) => {
    store.set(key, data);
  };

  const increment = async (key: string, windowMs: number) => {
    const now = Date.now();
    const record = store.get(key) || { count: 0, expires: now + windowMs };

    if (now > record.expires) {
      record.count = 1;
      record.expires = now + windowMs;
    } else {
      record.count++;
    }

    store.set(key, record);
    return { count: record.count, resetTime: record.expires };
  };

  return { get, set, increment };
};

import { RateLimiterOptions, LimitType } from "../types/RateLimiterOptions";

export const createRateLimiter = (options: RateLimiterOptions) => {
  const checkLimit = async (
    key: string,
    limit: LimitType
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
    const { storage } = options;

    const { count, resetTime } = await storage.increment(
      key,
      limit.windowMs || 60000
    );

    if (count > limit.max) {
      return { allowed: false, remaining: 0, resetTime: resetTime };
    }
    return {
      allowed: true,
      remaining: limit.max - count,
      resetTime: resetTime,
    };
  };

  return { checkLimit };
};


import { Request, Response, NextFunction } from "express";
import { createRateLimiter } from "../core/RateLimiter";
import { RateLimiterOptions } from "../types/RateLimiterOptions";

export const rateLimiterMiddleware = (options: RateLimiterOptions) => {
  const limiter = createRateLimiter(options);

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ? req.ip : ""; // Use IP as key; customize for user-specific limits.

    for (const limit of options.limits) {
      const { allowed, remaining, resetTime } = await limiter.checkLimit(
        key,
        limit
      );

      // Set rate-limiting headers
      res.setHeader("X-RateLimit-Limit", limit.max);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000));

      if (!allowed) {
        if (options.onLimitReached) {
          return options.onLimitReached(req, res);
        }
        return res.status(429).send("Rate limit exceeded");
      }
    }

    next();
  };
};
const dynamicLimit = (req: Request, plan: string, data?: { max: number, windowMs: number }): { max: number, windowMs: number } => {
    const isUserPlan = req.headers["x-user-plan"] === plan;
  
    if (isUserPlan) {
      return {
        max: data?.max ?? 100, 
        windowMs: data?.windowMs ?? 60000 
      };
    } else {
      return { max: 100, windowMs: 60000 };
    }
  };
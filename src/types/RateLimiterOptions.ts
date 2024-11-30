import { RateLimitStorage } from "./RateLimitStorage";
import { Request, Response } from "express";

export interface RateLimiterOptions {
  limits: LimitType[];
  storage: RateLimitStorage;
  whiteList?: string[];
  blackList?: string[];
  onLimitReached?: (req: Request, res: Response) => void;
}

export interface LimitType {
  type: "request" | "concurrent";
  max: number;
  windowMs: number;
}

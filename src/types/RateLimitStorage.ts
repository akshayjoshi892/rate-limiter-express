export interface RateLimitStorage {
  get(key: string): Promise<{ count: number; expires: number } | null>;
  increment(
    key: string,
    windowMs: number
  ): Promise<{ count: number; resetTime: number }>;
  set(key: string, data: { count: number; expires: number }): Promise<void>;
}

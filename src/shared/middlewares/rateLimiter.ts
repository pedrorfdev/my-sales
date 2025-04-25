import AppError from '@shared/errors/AppError';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

const redisClient = createClient({
  // url: 'redis://localhost:6379',
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASS || undefined,
});

redisClient.connect().catch(console.error);

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 5,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip as string);

    return next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}

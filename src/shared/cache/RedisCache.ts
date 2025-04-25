import cacheConfig from '@config/cache';
import Redis, { Redis as RedisClient } from 'ioredis';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  async save(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async recovery<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}

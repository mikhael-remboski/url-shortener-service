import { RedisCache } from '#api/infra/redis/redis.cache';
import { RedisConfigDTO } from '#api/infra/redis/redis.dto';
import Redis from 'ioredis';

export class RedisCacheImpl<T> implements RedisCache<T> {
  private readonly client: Redis;
  private readonly ttl: number;

  constructor(config: RedisConfigDTO) {
    this.ttl = config.ttl;

    this.client = new Redis({
      host: config.host,
      port: config.port,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
    });
    this.ttl = config.ttl;
  }

  async getOrExecute(key: string, execute: () => Promise<T>): Promise<T> {
    //TODO hit miss metric

    const cachedValue = await this.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await execute();
    await this.save(key, value);
    return value;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  private async get(key: string): Promise<T | undefined> {
    const value = await this.client.get(key);
    if (value === null) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  private async save(key: string, value: T): Promise<void> {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.setex(key, this.ttl, serializedValue);
  }
}

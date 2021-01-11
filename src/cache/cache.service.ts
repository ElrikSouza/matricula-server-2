import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import * as Env from '../env';

@Injectable()
export class CacheService {
  private redis: Redis.Redis;

  constructor() {
    this.redis = new Redis(Env.REDIS_PORT, Env.REDIS_HOST);
  }

  async get(key: Redis.KeyType) {
    return this.redis.get(key);
  }

  async set(
    key: Redis.KeyType,
    value: Redis.ValueType,
    expiryMode?: string | any[],
    time?: string | number,
    setMode?: string | number,
  ) {
    return this.redis.set(key, value, expiryMode, time, setMode);
  }

  async setObject(key: Redis.KeyType, value: Record<string, unknown>) {
    return this.redis.set(key, JSON.stringify(value));
  }

  async getObject(key: Redis.KeyType) {
    const stringResult = await this.redis.get(key);

    return JSON.parse(stringResult);
  }
}

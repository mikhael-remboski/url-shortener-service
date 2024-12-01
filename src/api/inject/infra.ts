import { RedisCache, RedisCacheImpl } from '#api/infra/redis';
import config from '#config';
import { DynamoClient, DynamoClientImpl } from '#api/infra/dynamo';

export const urlShortenerCache: RedisCache<string> = new RedisCacheImpl<string>(
  config.redis.urlShortener,
);

export const urlShortenerDynamoDB: DynamoClient = new DynamoClientImpl(
  config.dynamoDB.urlShortener,
);

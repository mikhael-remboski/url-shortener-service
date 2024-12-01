import { RedisCacheImpl } from '#api/infra/redis';
import config from '#config';
import { DynamoClientImpl } from '#api/infra/dynamo';

export const urlShortenerCache = new RedisCacheImpl<string>(
  config.redis.urlShortener,
);

export const urlShortenerDynamoDB = new DynamoClientImpl(
  config.dynamoDB.urlShortener,
);

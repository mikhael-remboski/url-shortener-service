import { ENV } from '#common/env';
import { AppConfig } from '#config/index';

export default {
  logger: {
    logLevel: 'debug',
  },
  dynamoDB: {
    urlShortener: {
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      maxAttempts: 2,
      tableName: 'url-shortener',
    },
  },
  redis: {
    urlShortener: {
      host: 'localhost',
      port: 6379,
      ttl: 60,
      maxRetriesPerRequest: 2,
    },
  },
  shortUrlHost: 'http://localhost:8080',
  env: ENV.LOCAL,
} as AppConfig;

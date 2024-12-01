import { AppConfig } from '#config/config';
import { ENV } from '#common/env';

export default {
  logger: {
    logLevel: 'info',
  },
  clients: {
    cartClient: {
      baseUrl: 'https://dummyjson.com',
      timeout: 10000,
      retries: 3,
      retryDelay: 100,
      shouldResetTimeout: false,
    },
  },
  env: ENV.STG,
} as AppConfig;

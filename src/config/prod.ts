import { ENV } from '#common/env';
import { AppConfig } from '#config/index';

export default {
  logger: {
    logLevel: 'warn',
  },
  clients: {},
  env: ENV.PROD,
} as AppConfig;

import { ENV } from '#common/env';
import { AppConfig } from '#config/index';

export default {
  logger: {
    logLevel: 'debug',
  },
  env: ENV.LOCAL,
} as AppConfig;

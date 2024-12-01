import { ENV } from '#common/env';
import { AppConfig } from '#config/index';

export default {
  logger: {
    logLevel: 'info',
  },
  clients: {},
  env: ENV.STG,
} as AppConfig;

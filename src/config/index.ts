import { ENV, getEnv } from '#common/env';
import local from './local';
import prod from './prod';
import stg from './stg';

export interface AppConfig {
  logger: {
    logLevel: string;
  };
  env: ENV;
}

const env: ENV = getEnv();

const config: AppConfig =
  env === ENV.LOCAL ? local : env === ENV.STG ? stg : prod;

export default config;

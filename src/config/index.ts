import { ENV, getEnv } from '#common/env';
import local from './local';
import prod from './prod';
import stg from './stg';
import { DynamoConfigDTO } from '#api/infra/dynamo';
import { RedisConfigDTO } from '#api/infra/redis';

export interface AppConfig {
  logger: {
    logLevel: string;
  };
  dynamoDB: {
    urlShortener: DynamoConfigDTO;
  };
  redis: {
    urlShortener: RedisConfigDTO;
  };
  shortUrlHost: string;
  env: ENV;
}

const env: ENV = getEnv();

const config: AppConfig =
  env === ENV.LOCAL ? local : env === ENV.STG ? stg : prod;

export default config;

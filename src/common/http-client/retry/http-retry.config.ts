import pino from 'pino';
import { AxiosError, AxiosInstance } from 'axios';
import Logger = pino.Logger;

export enum RetryStrategy {
  ALL = 'ALL',
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export type HttpRetryConfig = {
  retries: number;
  retryDelay: number;
  retryStrategy: RetryStrategy;
  axiosInstance: AxiosInstance;
  shouldResetTimeout: boolean;
  customRetryCondition?: (error: AxiosError) => boolean;
  logger?: Logger;
};

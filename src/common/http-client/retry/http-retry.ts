import axiosRetry from 'axios-retry';
import {
  HttpRetryConfig,
  RetryStrategy,
} from '#common/http-client/retry/http-retry.config';
import { AxiosError } from 'axios';

/**
 * Get the retry condition function based on the retry strategy.
 * @param {RetryStrategy} retryStrategy - The retry strategy to use.
 * @param {(error: AxiosError) => boolean} [customRetryCondition] - Custom retry condition function.
 * @returns {(error: AxiosError) => boolean} - The retry condition function.
 */
function getRetryCondition(
  retryStrategy: RetryStrategy,
  customRetryCondition?: (error: AxiosError) => boolean,
): (error: AxiosError) => boolean {
  switch (retryStrategy) {
    case RetryStrategy.ALL:
      return () => true;
    case RetryStrategy.DEFAULT:
      return (error: AxiosError) =>
        axiosRetry.isNetworkError(error) ||
        (error.response?.status || 500) >= 500 ||
        axiosRetry.isRetryableError(error);
    case RetryStrategy.CUSTOM:
      return customRetryCondition!;
  }
}

/**
 * Setup axios retry configuration.
 * @param {HttpRetryConfig} httpRetryConfig - The HTTP retry configuration.
 */
export function setupRetryConfig(httpRetryConfig: HttpRetryConfig): void {
  const {
    axiosInstance,
    retries,
    retryDelay,
    retryStrategy,
    customRetryCondition,
    shouldResetTimeout,
    logger,
  } = httpRetryConfig;

  const retryCondition = getRetryCondition(retryStrategy, customRetryCondition);

  axiosRetry(axiosInstance, {
    retries: retries,
    retryDelay: () => retryDelay,
    retryCondition: retryCondition,
    shouldResetTimeout: shouldResetTimeout,
    onRetry: (retryCount, error) => {
      if (logger) {
        logger.warn(`Retry attempt ${retryCount} for error: ${error.message}`);
      }
    },
  });
}

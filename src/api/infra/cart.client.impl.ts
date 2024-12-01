import {
  BaseHttpClient,
  HttpClientConfig,
} from '#common/http-client/http-client';
import { CartClient } from '#api/infra/cart.client';
import { ExternalCartsResponse } from '#external-models/cart/cart';
import { Endpoint } from '#types/endpoint';
import { setupRetryConfig } from '#common/http-client/retry/http-retry';
import { RetryStrategy } from '#common/http-client/retry/http-retry.config';
import logger from '#common/logger/logger';

export class CartClientImpl extends BaseHttpClient implements CartClient {
  constructor(config: Endpoint) {
    const options: HttpClientConfig = {
      baseURL: config.baseUrl,
      timeout: config.timeout,
    };

    super(options);
    setupRetryConfig({
      axiosInstance: this.instance,
      retries: config.retries,
      retryDelay: config.retryDelay,
      retryStrategy: RetryStrategy.ALL,
      shouldResetTimeout: config.shouldResetTimeout,
      logger: logger,
    });
  }

  async getCart(): Promise<ExternalCartsResponse> {
    const response = await this.instance.get<ExternalCartsResponse>('/carts', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
}

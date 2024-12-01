import Axios, { AxiosInstance } from 'axios';
import { ApiError } from '#common/errors/api-error';

export type HttpClientConfig = {
  baseURL: string;
  timeout: number;
};

export abstract class BaseHttpClient {
  protected readonly instance: AxiosInstance;

  protected constructor(options: HttpClientConfig) {
    if (!options.baseURL) {
      throw new ApiError('baseUrl required', 500);
    }
    this.instance = Axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout,
    });

    //TODO headers interceptor
  }
}

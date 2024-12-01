/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { ApiError } from '#common/errors/api-error';
import RequestContext from '#common/middlewares/request-context/request-context';
import logger from '#common/logger/logger';

/**
 * Handles HTTP errors by logging the error and returning an empty response.
 * @param fn - The function that returns a Promise.
 * @returns The result of the function or an empty object if an error occurs.
 */

export async function handleHttpErrorAndReturnEmpty<T>(
  fn: () => Promise<T>,
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      logger.error(
        {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          response: error.response?.data,
          status: error.response?.status,
          ...RequestContext.getInstance().data,
        },
        error.message,
      );
    } else {
      logger.error(
        {
          ...RequestContext.getInstance().data,
          stack: error.stack,
        },
        error.message,
      );
    }
    return undefined;
  }
}

/**
 * Handles HTTP errors by throwing an ApiError.
 * @param fn - The function that returns a Promise.
 * @throws ApiError
 */
export async function handleHttpErrorAndThrow<T>(
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw ApiError.fromAxiosError(error);
    } else {
      throw ApiError.fromError(error, {
        ...RequestContext.getInstance().data,
      });
    }
  }
}

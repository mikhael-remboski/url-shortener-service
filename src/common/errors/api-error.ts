import { AxiosError } from 'axios';
import RequestContext from '#common/middlewares/request-context/request-context';

/**
 * Custom error class to handle API-specific errors.
 * Extends the native Error class to include HTTP status codes and optional metadata.
 */
export class ApiError extends Error {
  /**
   * Creates a new instance of ApiError.
   * @param message - The error message describing the issue.
   * @param httpStatus - The HTTP status code associated with the error.
   * @param metadata - Optional additional metadata to provide context about the error.
   */
  constructor(
    message: string,
    readonly httpStatus: number,
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Converts an AxiosError into an ApiError.
   * @param error - The AxiosError to convert.
   * @returns An HttpError instance.
   */
  static fromAxiosError(error: AxiosError): ApiError {
    return new ApiError(error.message, error.response?.status || 500, {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      response: error.response?.data,
      ...RequestContext.getInstance().data,
    });
  }

  /**
   * Converts a generic Error into an ApiError.
   * @param error - The Error to convert.
   * @param metadata - Optional additional metadata to provide context about the error.
   * @returns An ApiError instance.
   */
  static fromError(error: Error, metadata?: Record<string, unknown>): ApiError {
    return new ApiError(error?.message, 500, metadata);
  }
}

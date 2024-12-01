import { v4 as uuidv4 } from 'uuid';

export interface RequestContextData {
  tid: string;
  headers: Record<string, string>;
}

/**
 * Singleton class to manage request-specific context.
 * This ensures that each request has a unique tracking ID (tid) and its headers stored.
 */
class RequestContext {
  public data: RequestContextData;
  private static instance: RequestContext;

  private constructor() {
    this.data = { tid: uuidv4(), headers: {} };
  }

  /**
   * Returns the singleton instance of the RequestContext.
   * If the instance doesn't exist, it creates a new one.
   * @returns {RequestContext} - The singleton instance.
   */
  public static getInstance(): RequestContext {
    if (!RequestContext.instance) {
      RequestContext.instance = new RequestContext();
    }
    return RequestContext.instance;
  }

  /**
   * Resets the context with a new unique tid and provided headers.
   * This ensures each request starts with a fresh context.
   * @param headers - Headers from the incoming request.
   */
  public reset(headers: Record<string, string> = {}): void {
    this.data = { tid: uuidv4(), headers };
  }
}

export default RequestContext;

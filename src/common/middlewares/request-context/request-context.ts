import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

/**
 * Interface that defines the structure of the application context data.
 */
export interface AppContextData {
  traceId?: string;
  path?: string;
  headers?: Record<string, string | number | boolean | string[]>;
}

/**
 * Class that manages the application context using AsyncLocalStorage.
 * Allows storing and accessing request-specific data anywhere in the code.
 */
export class AppContext {
  private static instance: AppContext;
  private storage: AsyncLocalStorage<AppContextData>;

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes the asynchronous storage.
   */
  private constructor() {
    this.storage = new AsyncLocalStorage<AppContextData>();
  }

  /**
   * Gets the single instance of AppContext.
   * @returns The instance of AppContext.
   */
  static getInstance(): AppContext {
    if (!this.instance) {
      this.instance = new AppContext();
    }
    return this.instance;
  }

  /**
   * Gets the current context data.
   * @returns The context data or undefined if there is no context.
   */
  getContext(): AppContextData | undefined {
    return this.storage.getStore();
  }

  /**
   * Gets the traceId from the current context.
   * @returns The traceId or undefined if there is no traceId.
   */
  getTraceId(): string | undefined {
    return this.getContext()?.traceId;
  }

  /**
   * Runs a function within a specific context.
   * @param ctx - The context data to set.
   * @param fn - The function to run within the context.
   * @returns The result of the executed function.
   */
  run<R>(ctx: AppContextData, fn: () => R): R {
    ctx.traceId = ctx.traceId || randomUUID();
    return this.storage.run(ctx, fn);
  }
}

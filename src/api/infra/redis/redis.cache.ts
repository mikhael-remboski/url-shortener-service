export interface RedisCache<T> {
  getOrExecute(key: string, execute: () => Promise<T>): Promise<T>;

  delete(key: string): Promise<void>;
}

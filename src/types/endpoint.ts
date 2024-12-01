export type Endpoint = {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  shouldResetTimeout: boolean;
};

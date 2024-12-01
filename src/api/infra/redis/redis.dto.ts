export interface RedisConfigDTO {
  host: string;
  port: number;
  ttl: number;
  maxRetriesPerRequest: number;
}

export interface DynamoDataDTO {
  id: string;
  url: string;
  createdAt: number;
}

export interface DynamoConfigDTO {
  endpoint: string;
  region: string;
  maxAttempts: number;
  tableName: string;
}

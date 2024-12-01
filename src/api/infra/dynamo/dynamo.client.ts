import { DynamoDataDTO } from '#api/infra/dynamo/dynamo.dto';

export interface DynamoClient {
  get: (id: string) => Promise<DynamoDataDTO>;
  put: (data: DynamoDataDTO) => Promise<DynamoDataDTO>;
  delete: (id: string) => Promise<void>;
}

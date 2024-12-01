import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoConfigDTO, DynamoDataDTO } from './dynamo.dto';
import { DynamoClient } from '#api/infra/dynamo/dynamo.client';

export class DynamoClientImpl implements DynamoClient {
  private readonly dynamoDBDocumentClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(config: DynamoConfigDTO) {
    const { tableName, ...clientConfig } = config;
    const dynamoDBClient = new DynamoDBClient(clientConfig);
    this.dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);
    this.tableName = tableName;
  }

  async get(id: string): Promise<DynamoDataDTO> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    });

    const result = await this.dynamoDBDocumentClient.send(command);

    if (!result.Item) {
      throw new Error(`Item with ID "${id}" not found`);
    }

    return {
      id: result.Item.id.S!,
      url: result.Item.url.S!,
      createdAt: parseInt(result.Item.createdAt.N!, 10),
    };
  }

  async put(data: DynamoDataDTO): Promise<DynamoDataDTO> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: data,
    });

    await this.dynamoDBDocumentClient.send(command);
    return data;
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });

    await this.dynamoDBDocumentClient.send(command);
  }
}

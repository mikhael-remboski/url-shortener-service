import { DynamoClient, DynamoDataDTO } from '#api/infra/dynamo';
import { RedisCache } from '#api/infra/redis';
import { UrlShortenerModel } from '#api/repositories/url-shortener/url-shortener.model';
import { safeAsync } from '#common/safe-async';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import { ApiError } from '#common/errors/api-error';
import logger from '#common/logger/logger';
import RequestContext from '#common/middlewares/request-context/request-context';
import { UrlShortenerRepository } from '#api/repositories/url-shortener/url-shortener.repository';

export class UrlShortenerRepositoryImpl implements UrlShortenerRepository {
  constructor(
    private readonly dynamoDB: DynamoClient,
    private readonly cache: RedisCache<string>,
  ) {}

  async getOriginalUrlByPath(shortUrlPath: string): Promise<UrlShortenerModel> {
    const originalUrl = await this.cache.getOrExecute(
      shortUrlPath,
      async () => {
        const record = await this.dynamoDB.get(shortUrlPath);
        return record.url;
      },
    );
    return {
      shortUrlPath: shortUrlPath,
      originalUrl,
    };
  }

  async saveNewShortPath(data: UrlShortenerModel): Promise<UrlShortenerModel> {
    const result = await safeAsync<DynamoDataDTO, DynamoDBServiceException>(
      () =>
        this.dynamoDB.put({
          id: data.shortUrlPath,
          url: data.originalUrl,
          createdAt: Date.now(),
        }),
    );

    if (result.isError()) {
      throw new ApiError(
        'Internal Server Error',
        result.error!.$response?.statusCode ?? 500,
        {
          retryable: result.error!.$retryable,
          message: result.error!.message,
        },
      );
    }

    return {
      shortUrlPath: result.data!.id,
      originalUrl: result.data!.url,
    };
  }

  async deleteShortUrlPath(shortUrlPath: string): Promise<void> {
    const [dynamoPromise, redisPromise] = [
      this.dynamoDB.delete(shortUrlPath),
      this.cache.delete(shortUrlPath),
    ];

    const [dynamoResult, redisResult] = await Promise.all([
      safeAsync<void, DynamoDBServiceException>(() => dynamoPromise),
      safeAsync(() => redisPromise),
    ]);

    if (dynamoResult.isError()) {
      throw new ApiError(
        'Failed to delete short URL',
        dynamoResult.error!.$response?.statusCode ?? 500,
        {
          retryable: dynamoResult.error!.$retryable,
          message: dynamoResult.error!.message,
        },
      );
    }

    if (redisResult.isError()) {
      logger.error(
        { ...RequestContext.getInstance().data },
        `${
          redisResult.error!.message ?? 'Failed to delete short URL from cache'
        }`,
      );
    }
  }
}

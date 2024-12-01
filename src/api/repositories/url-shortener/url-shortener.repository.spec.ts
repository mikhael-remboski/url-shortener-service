import { UrlShortenerRepositoryImpl } from '#api/repositories/url-shortener/url-shortener.repository.impl';
import { DynamoClient } from '#api/infra/dynamo';
import { RedisCache } from '#api/infra/redis';
import { ApiError } from '#common/errors/api-error';
import { UrlShortenerModel } from '#api/repositories/url-shortener/url-shortener.model';

describe('UrlShortenerRepositoryImpl', () => {
  let urlShortenerRepository: UrlShortenerRepositoryImpl;
  const mockDynamoDB: DynamoClient = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  const mockRedisCache: RedisCache<string> = {
    getOrExecute: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    urlShortenerRepository = new UrlShortenerRepositoryImpl(
      mockDynamoDB,
      mockRedisCache,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOriginalUrlByPath', () => {
    it('should return original URL from cache', async () => {
      const shortUrlPath = 'abc123';
      const originalUrl = 'https://example.com/long/path';

      mockRedisCache.getOrExecute = jest.fn().mockResolvedValue(originalUrl);

      const result =
        await urlShortenerRepository.getOriginalUrlByPath(shortUrlPath);

      expect(mockRedisCache.getOrExecute).toHaveBeenCalledWith(
        shortUrlPath,
        expect.any(Function),
      );
      expect(result).toEqual({ shortUrlPath, originalUrl });
    });

    it('should fetch original URL from DynamoDB if not in cache', async () => {
      const shortUrlPath = 'abc123';
      const originalUrl = 'https://example.com/long/path';

      mockRedisCache.getOrExecute = jest
        .fn()
        .mockImplementation(async (_, execute) => {
          return await execute();
        });

      mockDynamoDB.get = jest.fn().mockResolvedValue({ url: originalUrl });

      const result =
        await urlShortenerRepository.getOriginalUrlByPath(shortUrlPath);

      expect(mockRedisCache.getOrExecute).toHaveBeenCalledWith(
        shortUrlPath,
        expect.any(Function),
      );
      expect(mockDynamoDB.get).toHaveBeenCalledWith(shortUrlPath);
      expect(result).toEqual({ shortUrlPath, originalUrl });
    });

    it('should throw error if DynamoDB retrieval fails', async () => {
      const shortUrlPath = 'abc123';

      mockRedisCache.getOrExecute = jest
        .fn()
        .mockImplementation(async (_, execute) => {
          return await execute();
        });

      mockDynamoDB.get = jest.fn().mockRejectedValue(new Error('Failed'));

      await expect(
        urlShortenerRepository.getOriginalUrlByPath(shortUrlPath),
      ).rejects.toThrow(Error);
    });
  });

  describe('saveNewShortPath', () => {
    it('should save a new short URL path successfully', async () => {
      const data: UrlShortenerModel = {
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/long/path',
      };

      const mockSaveResponse = {
        id: 'abc123',
        url: 'https://example.com/long/path',
      };

      mockDynamoDB.put = jest.fn().mockResolvedValue(mockSaveResponse);

      const result = await urlShortenerRepository.saveNewShortPath(data);

      expect(result).toEqual(data);
    });

    it('should throw an error if saving short URL fails', async () => {
      const data: UrlShortenerModel = {
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/long/path',
      };

      mockDynamoDB.put = jest.fn().mockRejectedValueOnce(new Error('Failed'));

      await expect(
        urlShortenerRepository.saveNewShortPath(data),
      ).rejects.toThrow(ApiError);
    });
  });

  describe('deleteShortUrlPath', () => {
    it('should delete short URL from DynamoDB and cache', async () => {
      const shortUrlPath = 'abc123';

      mockDynamoDB.delete = jest.fn().mockResolvedValue(undefined);
      mockRedisCache.delete = jest.fn().mockResolvedValue(undefined);

      await urlShortenerRepository.deleteShortUrlPath(shortUrlPath);

      expect(mockDynamoDB.delete).toHaveBeenCalledWith(shortUrlPath);
      expect(mockRedisCache.delete).toHaveBeenCalledWith(shortUrlPath);
    });

    it('should throw an error if DynamoDB deletion fails', async () => {
      const shortUrlPath = 'abc123';

      mockDynamoDB.delete = jest
        .fn()
        .mockRejectedValue(new Error('Failed to delete'));

      await expect(
        urlShortenerRepository.deleteShortUrlPath(shortUrlPath),
      ).rejects.toThrow(ApiError);
    });
  });
});

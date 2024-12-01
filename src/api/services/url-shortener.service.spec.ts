import { UrlShortenerServiceImpl } from './url-shortener.service.impl';
import { UrlShortenerRepository } from '#api/repositories/url-shortener';
import { ShortenUrlRequest, UrlShortenerResponse } from '#domain/url-shortener';
import { nanoid } from 'nanoid';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

describe('UrlShortenerServiceImpl', () => {
  let urlShortenerService: UrlShortenerServiceImpl;
  const mockUrlShortenerRepository: UrlShortenerRepository = {
    getOriginalUrlByPath: jest.fn(),
    saveNewShortPath: jest.fn(),
    deleteShortUrlPath: jest.fn(),
  };
  const shortUrlHost = 'https://me.li';

  beforeEach(() => {
    urlShortenerService = new UrlShortenerServiceImpl(
      mockUrlShortenerRepository,
      shortUrlHost,
    );
    (nanoid as jest.Mock).mockReturnValue('abc123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortUrl', () => {
    it('should generate and save a short URL successfully', async () => {
      const shortenUrlReq: ShortenUrlRequest = {
        url: 'https://example.com/path',
      };
      const expectedResponse: UrlShortenerResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };

      (
        mockUrlShortenerRepository.saveNewShortPath as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await urlShortenerService.shortUrl(shortenUrlReq);

      expect(mockUrlShortenerRepository.saveNewShortPath).toHaveBeenCalledWith({
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/path',
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if saving the short URL fails', async () => {
      const shortenUrlReq: ShortenUrlRequest = {
        url: 'https://example.com/path',
      };
      (
        mockUrlShortenerRepository.saveNewShortPath as jest.Mock
      ).mockRejectedValue(new Error('Save failed'));

      await expect(urlShortenerService.shortUrl(shortenUrlReq)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('getUrl', () => {
    it('should return the original URL for a valid short URL path', async () => {
      const shortUrlPath = 'abc123';
      const repositoryResponse = {
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/path',
      };
      const expectedResponse: UrlShortenerResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };

      (
        mockUrlShortenerRepository.getOriginalUrlByPath as jest.Mock
      ).mockResolvedValue(repositoryResponse);

      const result = await urlShortenerService.getUrl(shortUrlPath);

      expect(
        mockUrlShortenerRepository.getOriginalUrlByPath,
      ).toHaveBeenCalledWith(shortUrlPath);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if retrieving the original URL fails', async () => {
      const shortUrlPath = 'abc123';

      (
        mockUrlShortenerRepository.getOriginalUrlByPath as jest.Mock
      ).mockRejectedValue(new Error('Retrieval failed'));

      await expect(urlShortenerService.getUrl(shortUrlPath)).rejects.toThrow(
        'Retrieval failed',
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete a short URL path successfully', async () => {
      const shortUrlPath = 'abc123';

      (
        mockUrlShortenerRepository.deleteShortUrlPath as jest.Mock
      ).mockResolvedValue(undefined);

      await urlShortenerService.deleteUrl(shortUrlPath);

      expect(
        mockUrlShortenerRepository.deleteShortUrlPath,
      ).toHaveBeenCalledWith(shortUrlPath);
    });

    it('should throw an error if deleting the short URL path fails', async () => {
      const shortUrlPath = 'abc123';

      (
        mockUrlShortenerRepository.deleteShortUrlPath as jest.Mock
      ).mockRejectedValue(new Error('Delete failed'));

      await expect(urlShortenerService.deleteUrl(shortUrlPath)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});

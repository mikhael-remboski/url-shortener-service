import { UrlShortenerServiceImpl } from './url-shortener.service.impl';
import { UrlShortenerRepository } from '#api/repositories/url-shortener';
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
      const url = new URL('https://example.com/path');
      const expectedResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };

      (
        mockUrlShortenerRepository.saveNewShortPath as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await urlShortenerService.shortUrl(url);

      expect(mockUrlShortenerRepository.saveNewShortPath).toHaveBeenCalledWith({
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/path',
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if saving the short URL fails', async () => {
      const url = new URL('https://example.com/path');
      (
        mockUrlShortenerRepository.saveNewShortPath as jest.Mock
      ).mockRejectedValue(new Error('Save failed'));

      await expect(urlShortenerService.shortUrl(url)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('getUrl', () => {
    it('should return the original URL for a valid short URL', async () => {
      const shortUrl = new URL('https://me.li/abc123');
      const repositoryResponse = {
        shortUrlPath: 'abc123',
        originalUrl: 'https://example.com/path',
      };
      const expectedResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };

      (
        mockUrlShortenerRepository.getOriginalUrlByPath as jest.Mock
      ).mockResolvedValue(repositoryResponse);

      const result = await urlShortenerService.getUrl(shortUrl);

      expect(
        mockUrlShortenerRepository.getOriginalUrlByPath,
      ).toHaveBeenCalledWith('/abc123');
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if the short URL hostname is invalid', async () => {
      const invalidShortUrl = new URL('https://invalid-short.ly/abc123');

      await expect(urlShortenerService.getUrl(invalidShortUrl)).rejects.toThrow(
        'Invalid short URL',
      );
    });

    it('should throw an error if retrieving the original URL fails', async () => {
      const shortUrl = new URL('https://me.li/abc123');

      (
        mockUrlShortenerRepository.getOriginalUrlByPath as jest.Mock
      ).mockRejectedValue(new Error('Retrieval failed'));

      await expect(urlShortenerService.getUrl(shortUrl)).rejects.toThrow(
        'Retrieval failed',
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete a short URL successfully', async () => {
      const shortUrl = new URL('https://me.li/abc123');

      (
        mockUrlShortenerRepository.deleteShortUrlPath as jest.Mock
      ).mockResolvedValue(undefined);

      await urlShortenerService.deleteUrl(shortUrl);

      expect(
        mockUrlShortenerRepository.deleteShortUrlPath,
      ).toHaveBeenCalledWith('/abc123');
    });

    it('should throw an error if deleting the short URL fails', async () => {
      const shortUrl = new URL('https://me.li/abc123');

      (
        mockUrlShortenerRepository.deleteShortUrlPath as jest.Mock
      ).mockRejectedValue(new Error('Delete failed'));

      await expect(urlShortenerService.deleteUrl(shortUrl)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});

import { UrlShortenControllerImpl } from './url-shorten.controller.impl';
import { UrlShortenerService } from '#api/services/url-shortener.service';
import { NextFunction, Request, Response } from 'express';

describe('UrlShortenControllerImpl', () => {
  const mockUrlShortenerService: jest.Mocked<UrlShortenerService> = {
    shortUrl: jest.fn(),
    getUrl: jest.fn(),
    deleteUrl: jest.fn(),
  };

  const urlShortenController = new UrlShortenControllerImpl(
    mockUrlShortenerService,
  );

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should create a short URL and return the response', async () => {
      mockRequest = {
        body: { url: 'https://example.com/path' },
      };

      const mockShortUrlResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };
      mockUrlShortenerService.shortUrl.mockResolvedValue(mockShortUrlResponse);

      await urlShortenController.shortenUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockUrlShortenerService.shortUrl).toHaveBeenCalledWith({
        url: 'https://example.com/path',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockShortUrlResponse);
    });

    it('should throw a validation error if the request body is invalid', async () => {
      mockRequest = { body: {} };

      await urlShortenController.shortenUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getUrl', () => {
    it('should return the original URL for a valid short URL path', async () => {
      mockRequest = {
        params: { shortUrlPath: 'abc123' },
      };

      const mockGetUrlResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };
      mockUrlShortenerService.getUrl.mockResolvedValue(mockGetUrlResponse);

      await urlShortenController.getUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockUrlShortenerService.getUrl).toHaveBeenCalledWith('abc123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGetUrlResponse);
    });

    it('should throw an error if shortUrlPath is missing', async () => {
      mockRequest = { params: {} };

      await urlShortenController.getUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a short URL path successfully', async () => {
      mockRequest = {
        params: { shortUrlPath: 'abc123' },
      };

      mockUrlShortenerService.deleteUrl.mockResolvedValue(undefined);

      await urlShortenController.deleteUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockUrlShortenerService.deleteUrl).toHaveBeenCalledWith('abc123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw an error if shortUrlPath is missing', async () => {
      mockRequest = { params: {} };

      await urlShortenController.deleteUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('redirectUrl', () => {
    it('should redirect to the original URL for a valid short URL path', async () => {
      mockRequest = {
        params: { shortUrlPath: 'abc123' },
      };

      const mockRedirectResponse = {
        shortUrl: 'https://me.li/abc123',
        originalUrl: 'https://example.com/path',
      };
      mockUrlShortenerService.getUrl = jest
        .fn()
        .mockResolvedValue(mockRedirectResponse);

      await urlShortenController.redirectUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockUrlShortenerService.getUrl).toHaveBeenCalledWith('abc123');
      expect(mockResponse.status).toHaveBeenCalledWith(301);
      expect(mockResponse.set).toHaveBeenCalledWith(
        'Cache-Control',
        'max-age=3600',
      );
      expect(mockResponse.set).toHaveBeenCalledWith(
        'Location',
        'https://example.com/path',
      );
    });

    it('should throw an error if shortUrlPath is missing', async () => {
      mockRequest = { params: {} };

      await urlShortenController.redirectUrl(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});

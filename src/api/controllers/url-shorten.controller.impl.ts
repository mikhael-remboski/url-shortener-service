import { UrlShortenController } from '#api/controllers/url-shorten.controller';
import { UrlShortenerService } from '#api/services/url-shortener.service';
import { asyncHandler } from '#common/async-handler/async-handler';
import { Request, Response } from 'express';
import { ShortenUrlRequestSchema } from '#domain/url-shortener';
import { ApiError } from '#common/errors/api-error';

export class UrlShortenControllerImpl implements UrlShortenController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  shortenUrl = asyncHandler(async (req: Request, res: Response) => {
    const reqBody = req.body;
    await ShortenUrlRequestSchema.parseAsync(reqBody);
    const response = await this.urlShortenerService.shortUrl(reqBody);
    res.status(201).json(response);
  });

  getUrl = asyncHandler(async (req: Request, res: Response) => {
    const shortUrlPath = req.params.shortUrlPath;
    if (!shortUrlPath) {
      throw new ApiError('Short URL path is required', 400);
    }
    const response = await this.urlShortenerService.getUrl(shortUrlPath);
    res.status(200).json(response);
  });

  deleteUrl = asyncHandler(async (req: Request, res: Response) => {
    const shortUrlPath = req.params.shortUrlPath;
    if (!shortUrlPath) {
      throw new ApiError('Short URL path is required', 400);
    }
    await this.urlShortenerService.deleteUrl(shortUrlPath);
    res.status(204).send();
  });

  redirectUrl = asyncHandler(async (req: Request, res: Response) => {
    const shortUrlPath = req.params.shortUrlPath;
    if (!shortUrlPath) {
      throw new ApiError('Short URL path is required', 400);
    }
    const response = await this.urlShortenerService.getUrl(shortUrlPath);
    res.redirect(response.originalUrl);
  });
}

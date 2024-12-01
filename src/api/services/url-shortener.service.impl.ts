import { UrlShortenerService } from '#api/services/url-shortener.service';
import {
  UrlShortenerResponse,
  UrlShortenerResponseSchema,
} from '#domain/url-shortener';
import { UrlShortenerRepository } from '#api/repositories/url-shortener';
import { nanoid } from 'nanoid';
import { ApiError } from '#common/errors/api-error';

export class UrlShortenerServiceImpl implements UrlShortenerService {
  constructor(
    private readonly urlShortenerRepository: UrlShortenerRepository,
    private readonly shortUrlHost: string,
  ) {}

  async shortUrl(url: URL): Promise<UrlShortenerResponse> {
    const shortUrlPath = nanoid(6);
    const shortUrlHost = this.shortUrlHost;
    const originalUrl = `${url.protocol}//${url.host}${url.pathname}`;

    await this.urlShortenerRepository.saveNewShortPath({
      shortUrlPath: shortUrlPath,
      originalUrl: originalUrl,
    });

    const response: UrlShortenerResponse = {
      shortUrl: `${shortUrlHost}/${shortUrlPath}`,
      originalUrl: originalUrl,
    };

    await UrlShortenerResponseSchema.parseAsync(response);

    return response;
  }

  async getUrl(shortUrl: URL): Promise<UrlShortenerResponse> {
    if (shortUrl.hostname !== new URL(this.shortUrlHost).hostname) {
      throw new ApiError('Invalid short URL', 400);
    }

    const shortUrlPath = shortUrl.pathname;

    const shorUrlResponse =
      await this.urlShortenerRepository.getOriginalUrlByPath(shortUrlPath);

    const response: UrlShortenerResponse = {
      shortUrl: `${this.shortUrlHost}/${shorUrlResponse.shortUrlPath}`,
      originalUrl: shorUrlResponse.originalUrl,
    };

    await UrlShortenerResponseSchema.parseAsync(response);

    return response;
  }

  async deleteUrl(shortUrl: URL): Promise<void> {
    const shortUrlPath = shortUrl.pathname;

    return this.urlShortenerRepository.deleteShortUrlPath(shortUrlPath);
  }
}

import { UrlShortenerService } from '#api/services/url-shortener.service';
import {
  ShortenUrlRequest,
  UrlShortenerResponse,
  UrlShortenerResponseSchema,
} from '#domain/url-shortener';
import { UrlShortenerRepository } from '#api/repositories/url-shortener';
import { nanoid } from 'nanoid';

export class UrlShortenerServiceImpl implements UrlShortenerService {
  constructor(
    private readonly urlShortenerRepository: UrlShortenerRepository,
    private readonly shortUrlHost: string,
  ) {}

  async shortUrl(
    shortenUrlReq: ShortenUrlRequest,
  ): Promise<UrlShortenerResponse> {
    const shortUrlPath = nanoid(6);
    const shortUrlHost = this.shortUrlHost;
    const originalUrl = shortenUrlReq.url;

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

  async getUrl(shortUrlPath: string): Promise<UrlShortenerResponse> {
    const shorUrlResponse =
      await this.urlShortenerRepository.getOriginalUrlByPath(shortUrlPath);

    const response: UrlShortenerResponse = {
      shortUrl: `${this.shortUrlHost}/${shorUrlResponse.shortUrlPath}`,
      originalUrl: shorUrlResponse.originalUrl,
    };

    await UrlShortenerResponseSchema.parseAsync(response);

    return response;
  }

  async deleteUrl(shortUrlPath: string): Promise<void> {
    return this.urlShortenerRepository.deleteShortUrlPath(shortUrlPath);
  }
}

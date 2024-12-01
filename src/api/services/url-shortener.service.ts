import { ShortenUrlRequest, UrlShortenerResponse } from '#domain/url-shortener';

export interface UrlShortenerService {
  shortUrl(shortenUrlReq: ShortenUrlRequest): Promise<UrlShortenerResponse>;

  getUrl(shortUrlPath: string): Promise<UrlShortenerResponse>;

  deleteUrl(shortUrlPath: string): Promise<void>;
}

import { UrlShortenerResponse } from '#domain/url-shortener';

export interface UrlShortenerService {
  shortUrl(url: URL): Promise<UrlShortenerResponse>;

  getUrl(shortUrl: URL): Promise<UrlShortenerResponse>;

  deleteUrl(shortUrl: URL): Promise<void>;
}

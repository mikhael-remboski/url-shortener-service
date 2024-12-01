import { UrlShortenerModel } from '#api/repositories/url-shortener/url-shortener.model';

export interface UrlShortenerRepository {
  saveNewShortPath(data: UrlShortenerModel): Promise<UrlShortenerModel>;

  getOriginalUrlByPath(shortUrlPath: string): Promise<UrlShortenerModel>;

  deleteShortUrlPath(shortUrlPath: string): Promise<void>;
}

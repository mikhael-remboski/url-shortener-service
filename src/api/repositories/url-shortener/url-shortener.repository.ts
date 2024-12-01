import { UrlShortenerModel } from '#api/repositories/url-shortener/url-shortener.model';

export interface UrlShortenerRepository {
  saveNewShortUrl(data: UrlShortenerModel): Promise<UrlShortenerModel>;
  getOriginalUrlByShortUrl(shortUrl: string): Promise<UrlShortenerModel>;
  deleteShortUrl(shortUrl: string): Promise<void>;
}

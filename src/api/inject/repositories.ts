import { UrlShortenerRepositoryImpl } from '#api/repositories/url-shortener';
import { urlShortenerCache, urlShortenerDynamoDB } from '#api/inject/infra';

export const urlShortenerRepository = new UrlShortenerRepositoryImpl(
  urlShortenerDynamoDB,
  urlShortenerCache,
);

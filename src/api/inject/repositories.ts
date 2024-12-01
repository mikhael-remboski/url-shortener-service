import {
  UrlShortenerRepository,
  UrlShortenerRepositoryImpl,
} from '#api/repositories/url-shortener';
import { urlShortenerCache, urlShortenerDynamoDB } from '#api/inject/infra';

export const urlShortenerRepository: UrlShortenerRepository =
  new UrlShortenerRepositoryImpl(urlShortenerDynamoDB, urlShortenerCache);

import { UrlShortenerService } from '#api/services/url-shortener.service';
import { UrlShortenerServiceImpl } from '#api/services/url-shortener.service.impl';
import { urlShortenerRepository } from '#api/inject/repositories';
import config from '#config';

export const urlShortenService: UrlShortenerService =
  new UrlShortenerServiceImpl(urlShortenerRepository, config.shortUrlHost);

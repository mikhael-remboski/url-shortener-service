import { UrlShortenControllerImpl } from '#api/controllers/url-shorten.controller.impl';
import { urlShortenService } from '#api/inject/services';
import { UrlShortenController } from '#api/controllers/url-shorten.controller';

export const urlShortenController: UrlShortenController =
  new UrlShortenControllerImpl(urlShortenService);

import { NextFunction, Request, Response, Router } from 'express';
import { UrlShortenController } from '#api/controllers/url-shorten.controller';

const SHORTEN_URL_PATH = '/v1/url/shorten';
const GET_URL_PATH = '/v1/url/:shortUrlPath';
const DELETE_URL_PATH = '/v1/url/:shortUrlPath';
const REDIRECT_URL_PATH = '/:shortUrlPath';
const RESERVED_PATHS = ['/health', '/v1', '/api.json'];

export default function createUrlShortenRouter(
  controller: UrlShortenController,
): Router {
  const router: Router = Router();

  router.post(SHORTEN_URL_PATH, controller.shortenUrl);
  router.get(GET_URL_PATH, controller.getUrl);
  router.delete(DELETE_URL_PATH, controller.deleteUrl);

  router.get(
    REDIRECT_URL_PATH,
    (req: Request, res: Response, next: NextFunction) => {
      const path = `/${req.params.shortUrlPath}`;
      if (RESERVED_PATHS.includes(path)) {
        return next();
      }
      return controller.redirectUrl(req, res, next);
    },
  );

  return router;
}

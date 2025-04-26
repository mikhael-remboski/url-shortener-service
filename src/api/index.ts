import express, { Application } from 'express';
import openApiRouter from '#api/openapi/openapi.router';
import urlShortenerRouter from '#api/routers/url-shortener.router';
import { urlShortenController } from '#api/inject/controllers';
import cors from 'cors';
import { requestContextMiddleware } from '#common/middlewares/request-context/request-context.middleware';

const bootstrap = (): Application => {
  const app: express.Application = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.disable('x-powered-by');

  app.use(requestContextMiddleware);
  app.use(openApiRouter());
  app.use(urlShortenerRouter(urlShortenController));
  return app;
};

export default bootstrap;

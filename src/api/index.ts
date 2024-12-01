import express, { Application } from 'express';
import requestContextMiddleware from '#common/middlewares/request-context/request-context.middleware';
import openApiRouter from '#api/openapi/openapi.router';
import cartRouter from '#api/routers/cart.router';
import { getCartController } from '#api/inject/controllers';

const bootstrap = (): Application => {
  const app: express.Application = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.disable('x-powered-by');

  app.use(requestContextMiddleware);
  app.use(openApiRouter());
  app.use(cartRouter(getCartController()));
  return app;
};

export default bootstrap;

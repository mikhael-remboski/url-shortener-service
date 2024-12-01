import { NextFunction, Request, Response, Router } from 'express';
import { getOpenApiSpec } from '#api/openapi/index';

const OPEN_API_PATH = '/api.json';

export default function getRouter(): Router {
  const openApiRouter = Router();

  openApiRouter.get(
    OPEN_API_PATH,
    (_req: Request, res: Response, _next: NextFunction) =>
      res.json(getOpenApiSpec()),
  );

  return openApiRouter;
}

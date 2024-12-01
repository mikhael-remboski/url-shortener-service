import { NextFunction, Request, Response } from 'express';
import RequestContext from '#common/middlewares/request-context/request-context';

/**
 * Middleware to set the request context for each incoming request.
 * Extracts headers from the request and initializes the request context.
 * Ensures a unique context is created per request.
 * @param _req - The incoming request object.
 * @param _res - The outgoing response object (unused).
 * @param next - The next middleware function in the chain.
 */
function requestContextMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  const context = RequestContext.getInstance();

  context.reset({});

  next();
}

export default requestContextMiddleware;

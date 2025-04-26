import type { NextFunction, Request, Response } from 'express';
import { AppContext } from '#common/middlewares/request-context/request-context';

/**
 * Middleware to set the request context for each incoming request.
 * Extracts headers from the request and initializes the request context.
 * Ensures a unique context is created per request.
 * @param req - The incoming request object.
 * @param _res - The outgoing response object (unused).
 * @param next - The next middleware function in the chain.
 */
export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const path = req.path;
  const traceId = req.header('x-trace-id');
  AppContext.getInstance().run(
    {
      path: path,
      traceId: traceId,
    },
    next,
  );
}

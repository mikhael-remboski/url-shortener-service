import { NextFunction, Request, Response } from 'express';
import { ApiError } from '#common/errors/api-error';
import logger from '#common/logger/logger';
import RequestContext from '#common/middlewares/request-context/request-context';

/**
 * Middleware to handle errors in the application.
 * Logs errors using a logger and sends an appropriate JSON response.
 * @returns A middleware function that handles errors thrown in the app.
 */
function errorHandlerMiddleware() {
  return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const reqId = RequestContext.getInstance().data.tid;

    if (res.headersSent) {
      logger.warn({ message: 'Response already sent', reqId });
      return;
    }

    if (err instanceof ApiError) {
      logger.error(
        { ...err.metadata, reqId: reqId, httpStatus: err.httpStatus },
        err.message,
      );
      return res.status(err.httpStatus).json({
        message: err.message,
        httpStatus: err.httpStatus,
      });
    }

    logger.error({ httpStatus: 500, reqId: reqId }, err.message);
    res.status(500).json({
      message: 'Internal server error',
      httpStatus: 500,
    });
  };
}

export default errorHandlerMiddleware;

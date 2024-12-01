import type { NextFunction, Request, Response } from 'express';
import logger from '#common/logger/logger';
import { ZodError } from 'zod';
import { ApiError } from '#common/errors/api-error';
import RequestContext from '#common/middlewares/request-context/request-context';

type ControllerAction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

interface FormattedError {
  path: string;
  message: string;
}

const handleZodError = (res: Response, error: ZodError) => {
  const formattedErrors: FormattedError[] = error.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
  logger.error(
    { errors: formattedErrors, ...RequestContext.getInstance() },
    'Zod error',
  );
  res.status(400).json(formattedErrors);
};

/**
 * Wraps an asynchronous controller action to handle errors gracefully.
 *
 * @param action - The asynchronous controller action to be executed.
 * @returns A middleware function to handle the async action with proper error handling.
 */
export const asyncHandler =
  (action: ControllerAction) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await action(req, res, next);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        handleZodError(res, error);
        return;
      }

      if (error instanceof ApiError) {
        logger.error(
          {
            metadata: error.metadata,
            httpStatus: error.httpStatus,
            ...RequestContext.getInstance(),
          },
          error.message,
        );
        res.status(error.httpStatus || 500).json({
          message: error.message,
          httpStatus: error.httpStatus,
          name: error.name,
        });
        return;
      }

      logger.error(
        {
          error,
          ...RequestContext.getInstance(),
        },
        error.message,
      );
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
  };

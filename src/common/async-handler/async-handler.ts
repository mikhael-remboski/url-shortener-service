import type { NextFunction, Request, Response } from 'express';

type ControllerAction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

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
    } catch (error: unknown) {
      next(error);
    }
  };

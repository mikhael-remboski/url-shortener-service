import { Request, Response } from 'express';
import logger from '#common/logger/logger';

export function fourZeroFourMiddleware(req: Request, res: Response) {
  logger.warn(
    {
      method: req.method,
      hostName: req.hostname,
      originalUrl: req.originalUrl,
    },
    '404 Not Found',
  );
  res.status(404).json({ message: 'Not Found' });
}

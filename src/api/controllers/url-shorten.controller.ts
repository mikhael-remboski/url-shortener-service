import { NextFunction, Request, Response } from 'express';

export interface UrlShortenController {
  shortenUrl(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void>;

  getUrl(req: Request, response: Response, next: NextFunction): Promise<void>;

  deleteUrl(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void>;

  redirectUrl(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void>;
}

import { NextFunction, Request, Response } from 'express';

export interface CartController {
  getCart(req: Request, res: Response, next: NextFunction): Promise<void>;
}

import { CartController } from '#api/controllers/cart.controller';
import { CartService } from '#api/services/cart.service';
import { NextFunction, Request, Response } from 'express';
import { CartSchema } from '#domain/cart';
import { asyncHandler } from '#common/async-handler/async-handler';

export class CartControllerImpl implements CartController {
  constructor(private readonly cartService: CartService) {}

  getCart = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const cartResponse = await this.cartService.getCart();
      await CartSchema.parseAsync(cartResponse);

      res.status(200).json(cartResponse);
    },
  );
}

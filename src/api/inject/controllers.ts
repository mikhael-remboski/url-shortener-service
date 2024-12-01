import { CartControllerImpl } from '#api/controllers/cart.controller.impl';
import { CartController } from '#api/controllers/cart.controller';
import { getCartService } from '#api/inject/services';

export function getCartController(): CartController {
  return new CartControllerImpl(getCartService());
}

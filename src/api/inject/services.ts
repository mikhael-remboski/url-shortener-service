import { CartService } from '#api/services/cart.service';
import { CartServiceImpl } from '#api/services/cart.service.impl';
import { getCartClient } from '#api/inject/clients';

export function getCartService(): CartService {
  return new CartServiceImpl(getCartClient());
}

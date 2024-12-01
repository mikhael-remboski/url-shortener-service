import { CartClient } from '#api/infra/cart.client';
import { CartClientImpl } from '#api/infra/cart.client.impl';
import config from '#config/config';

export function getCartClient(): CartClient {
  return new CartClientImpl(config.clients.cartClient);
}

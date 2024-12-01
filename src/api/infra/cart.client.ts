import { ExternalCartsResponse } from '#external-models/cart/cart';

export interface CartClient {
  getCart(): Promise<ExternalCartsResponse>;
}

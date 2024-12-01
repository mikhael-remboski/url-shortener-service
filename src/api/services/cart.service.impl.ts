import { Cart, Item } from '#domain/cart';
import { CartService } from '#api/services/cart.service';
import { CartClient } from '#api/infra/cart.client';
import {
  ExternalCartResponse,
  ExternalCartsResponse,
} from '#external-models/cart/cart';
import { handleHttpErrorAndThrow } from '#common/http-client/http-error.handler';

export class CartServiceImpl implements CartService {
  constructor(private readonly cartClient: CartClient) {}

  async getCart(): Promise<Cart> {
    const externalCartResponse: ExternalCartResponse =
      await this.getExternalCart();
    return this.mapCart(externalCartResponse);
  }

  private async getExternalCart(): Promise<ExternalCartResponse> {
    const response: ExternalCartsResponse = await handleHttpErrorAndThrow(() =>
      this.cartClient.getCart(),
    );

    return response.carts[0];
  }

  private mapCart(cart: ExternalCartResponse): Cart {
    const items: Item[] = cart.products.map((product) => ({
      id: product.id.toString(),
      quantity: product.quantity,
    }));
    return {
      cartId: cart.id.toString(),
      items: items,
    };
  }
}

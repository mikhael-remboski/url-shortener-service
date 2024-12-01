import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const ItemSchema = z
  .object({
    id: z.string(),
    quantity: z.number(),
  })
  .openapi('Item');

export const CartSchema = z
  .object({
    cartId: z.string(),
    items: z.array(ItemSchema),
  })
  .openapi('Cart');

export type Item = z.infer<typeof ItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

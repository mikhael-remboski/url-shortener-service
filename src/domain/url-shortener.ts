import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UrlShortenerResponseSchema = z
  .object({
    shortUrl: z.string(),
    originalUrl: z.string(),
  })
  .openapi('UrlShortenerResponse');

export type UrlShortenerResponse = z.infer<typeof UrlShortenerResponseSchema>;

export const ShortenUrlRequestSchema = z.object({
  url: z.string().url(),
});

export type ShortenUrlRequest = z.infer<typeof ShortenUrlRequestSchema>;

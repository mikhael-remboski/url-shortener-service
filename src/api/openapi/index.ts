import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  ShortenUrlRequestSchema,
  UrlShortenerResponseSchema,
} from '#domain/url-shortener';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const ErrorResponseSchema = z.object({
  message: z.string(),
  name: z.string(),
  httpStatus: z.number(),
});

function registerPaths() {
  registry.registerPath({
    method: 'post',
    path: '/v1/url/shorten',
    operationId: 'shortUrl',
    description: 'Create a new short URL',
    summary: 'Create a new short URL',
    tags: ['url-shortener'],
    security: [],
    request: {
      headers: z.object({
        Authorization: z.string(), // TODO: Add auth
      }),
      body: {
        content: {
          'application/json': {
            schema: ShortenUrlRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Short URL created successfully',
        content: {
          'application/json': {
            schema: UrlShortenerResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/v1/url/{shortUrlPath}',
    operationId: 'getUrl',
    description: 'Retrieve the original URL from a short URL path',
    summary: 'Retrieve original URL',
    tags: ['url-shortener'],
    request: {
      params: z.object({
        shortUrlPath: z.string(),
      }),
      headers: z.object({
        Authorization: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Original URL retrieved successfully',
        content: {
          'application/json': {
            schema: UrlShortenerResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'Short URL not found',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/v1/url/{shortUrlPath}',
    operationId: 'deleteUrl',
    description: 'Delete a short URL',
    summary: 'Delete short URL',
    tags: ['url-shortener'],
    request: {
      params: z.object({
        shortUrlPath: z.string(),
      }),
      headers: z.object({
        Authorization: z.string(),
      }),
    },
    responses: {
      204: {
        description: 'Short URL deleted successfully',
      },
      400: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/{shortUrlPath}',
    operationId: 'redirectUrl',
    description: 'Redirect to the original URL',
    summary: 'Redirect to original URL',
    tags: ['url-shortener'],
    request: {
      params: z.object({
        shortUrlPath: z.string(),
      }),
      headers: z.object({
        Authorization: z.string(),
      }),
    },
    responses: {
      301: {
        description: 'Redirect to the original URL',
        headers: z.object({
          Location: z.string(),
          'Cache-Control': z.string(),
        }),
      },
      400: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: 'Short URL not found',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}

export function getOpenApiSpec() {
  registerPaths();
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'url-shortener-service',
      description: 'Url shortener service',
    },
    servers: [{ url: '/v1' }],
  });
}

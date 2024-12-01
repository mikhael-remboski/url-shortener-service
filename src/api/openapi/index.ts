import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

function registerPaths() {}

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

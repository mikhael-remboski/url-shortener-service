import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '../errors/api-error';
import { asyncHandler } from './async-handler';

const app = express();
app.use(express.json());

const successController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

const apiErrorController = asyncHandler(async () => {
  throw new ApiError('Test API Error', 400);
});

const genericErrorController = asyncHandler(async () => {
  throw new Error('Generic error');
});

const zodValidationController = asyncHandler(
  async (req: Request, _res: Response) => {
    const schema = z.object({
      id: z.string().uuid(),
    });
    schema.parse(req.body); // Will throw a ZodError if validation fails
  },
);

app.use('/success', successController);
app.use('/api-error', apiErrorController);
app.use('/generic-error', genericErrorController);
app.use('/zod-error', zodValidationController);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.httpStatus).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

describe('asyncHandler Middleware', () => {
  it('should handle a successful response', async () => {
    const response = await request(app).get('/success');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });

  it('should handle an ApiError and return the correct status and message', async () => {
    const response = await request(app).get('/api-error');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Test API Error',
      httpStatus: 400,
      name: 'ApiError',
    });
  });

  it('should handle a generic error and return a 500 status', async () => {
    const response = await request(app).get('/generic-error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });

  it('should handle a ZodError and return a 400 status with formatted error details', async () => {
    const response = await request(app)
      .post('/zod-error')
      .send({ id: 'invalid-uuid' }); // Invalid UUID to trigger ZodError
    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        path: 'id',
        message: 'Invalid uuid',
      },
    ]);
  });
});

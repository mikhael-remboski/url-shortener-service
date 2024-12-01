import { Application } from 'express';
import bootstrap from '#api';
import 'dotenv/config';
import { healthCheck } from '#common/health/health-check';
import { fourZeroFourMiddleware } from '#common/middlewares/404/four-zero-four.middleware';

const HEALTH_CHECK_PATH = '/health';

const app: Application = bootstrap();
app.get(HEALTH_CHECK_PATH, healthCheck);

app.use(fourZeroFourMiddleware);

export default app;

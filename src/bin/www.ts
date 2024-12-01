import http from 'http';
import app from './server';
import logger from '#common/logger/logger';

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info({ message: `🚀 Server running at http://localhost:${PORT}` });
});

server.on('error', (error: NodeJS.ErrnoException) => {
  logger.error({ message: 'Error starting server', error });
  process.exit(1);
});

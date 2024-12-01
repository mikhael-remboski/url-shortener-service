import pino from 'pino';
import config from '#config/config';
import { ENV } from '#common/env';

/**
 * Configures and exports the logger instance.
 * Uses the 'pino' library for fast, low-overhead logging.
 */

const transport =
  config.env === ENV.LOCAL
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined;

const logger = pino({
  level: config.logger.logLevel,
  transport: transport,
});

export default logger;

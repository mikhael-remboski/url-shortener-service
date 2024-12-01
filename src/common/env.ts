/**
 * Enum representing the possible environments where the server can run.
 */
export enum ENV {
  LOCAL = 'local',
  STG = 'stg',
  PROD = 'prod',
}

/**
 * Retrieves the current environment where the server is running.
 * Defaults to 'LOCAL' if the environment is not set or invalid.
 *
 * @returns {ENV} - The environment in which the server is operating.
 */
export function getEnv(): ENV {
  const nodeEnv = (process.env.NODE_ENV?.toUpperCase() ||
    'LOCAL') as keyof typeof ENV;

  if (!(nodeEnv in ENV)) {
    return ENV.LOCAL;
  }

  return ENV[nodeEnv];
}

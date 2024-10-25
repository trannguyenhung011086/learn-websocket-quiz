export const env = {
  DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV || 'local',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
};

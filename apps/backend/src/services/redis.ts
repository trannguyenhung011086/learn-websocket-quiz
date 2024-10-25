import { createClient } from 'redis';
import { env } from '../env';

const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
  },
});
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

export { redisClient, pubClient, subClient };

import { env } from './env';
import { server } from './server';

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

server.listen(env.PORT, () => {
  console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});

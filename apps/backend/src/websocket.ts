import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from './services/redis';
import { testMessage } from './socketHandlers/testMessage';
import { joinQuiz } from './socketHandlers/joinQuiz';
import { Server as HttpServer } from 'http';

let io: Server;

export const initIO = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins for testing purposes
      methods: ['GET', 'POST'],
    },
  });

  // Use Redis adapter to handle pub/sub across Socket.io instances
  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
    })
    .catch((err) => {
      console.error('Failed to connect to Redis', err);
      throw new Error('Failed to connect to Redis');
    });

  const onConnection = (socket: Socket) => {
    console.log('A user connected');

    // Handle test message
    testMessage(io, socket);

    // Handle join quiz
    joinQuiz(io, socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  };

  io.on('connection', onConnection);

  console.log('Socket.io initialized');
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized! Make sure to call initIO first.');
  }
  return io;
};

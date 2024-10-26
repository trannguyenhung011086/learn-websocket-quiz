import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from './services/redis';
import routes from './routes/routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';
import { testMessage } from './socketHandlers/testMessage';
import { joinQuiz } from './socketHandlers/joinQuiz';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing purposes
    methods: ['GET', 'POST'],
  },
});

// Use Redis adapter to handle pub/sub across Socket.io instances
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

app.use(express.json());

// Serve a simple HTML file to test WebSocket in the browser
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

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

export { app, io, server };

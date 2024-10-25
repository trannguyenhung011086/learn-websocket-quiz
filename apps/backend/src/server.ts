import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from './services/redis';
import routes from './routes/routes';
import { quizScoresRepo } from './repo/quizScores.repo';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';

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

// Handle WebSocket connection for each user
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for a test "message" event
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.emit('message', `Echo: ${msg}`); // Send a response back
  });

  // Join a quiz session
  socket.on('join-quiz', async ({ quizId, userId }: { quizId: string; userId: string }) => {
    if (!quizId || !userId) {
      socket.emit('error', 'Missing quizId or userId');
      return;
    }

    socket.join(quizId);
    console.log(`User ${userId} joined quiz: ${quizId}`);

    // Broadcast to the quiz room that a new user has joined
    io.to(quizId).emit('user-joined', { userId, quizId });

    // Broadcast the current scores to the newly joined user
    const quizScores = await quizScoresRepo.getByQuizId(quizId);
    if (quizScores[userId]) {
      socket.emit('initial-scores', {
        quizId,
        scores: quizScores[userId],
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

export { app, io, server };

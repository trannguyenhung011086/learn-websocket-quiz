import express from 'express';
import http from 'http';
import routes from './routes/routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';
import { initIO } from './websocket';

const app = express();
const server = http.createServer(app);

// Attach socket.io to the server
initIO(server);

app.use(express.json());

// Serve a simple HTML file to test WebSocket in the browser
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app, server };

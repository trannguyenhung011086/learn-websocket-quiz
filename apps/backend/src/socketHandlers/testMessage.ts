import { Server, Socket } from 'socket.io';

export const testMessage = (io: Server, socket: Socket) => {
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.emit('message', `Echo: ${msg}`); // Send a response back
  });
};

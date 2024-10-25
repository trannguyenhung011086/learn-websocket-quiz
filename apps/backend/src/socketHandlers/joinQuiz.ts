import { Server, Socket } from 'socket.io';
import { quizScoresRepo } from '../repo/quizScores.repo';

export const joinQuiz = (io: Server, socket: Socket) => {
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
};

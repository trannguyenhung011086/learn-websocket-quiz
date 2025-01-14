import { Request, Response } from 'express';
import { processAnswer } from '../../commands/processAnswer';
import { getIO } from '../../websocket';

export async function submitAnswerHandler(req: Request, res: Response) {
  const { quizId, userId, questionId, answerId } = req.body;

  // Validate request body, should use Zod schema to validate properly
  if (!quizId || !userId || !questionId || !answerId) {
    res.status(400).json({
      message: 'Missing quizId, userId, questionId, or answerId',
    });
    return;
  }

  const { outcome, message, currentScore } = await processAnswer({ quizId, userId, questionId, answerId });

  if (outcome === 'error') {
    res.status(500).json({ message });
    return;
  }

  const io = getIO();

  // Broadcast the updated scores to all participants in the quiz room
  io.to(quizId).emit('score-update', {
    userId,
    score: currentScore,
  });
  console.log(`Score updated for user ${userId} in quiz ${quizId}: ${currentScore}`);

  res.json({
    message: 'Score updated successfully',
    currentScore,
  });
}

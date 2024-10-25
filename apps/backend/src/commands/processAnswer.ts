import { quizScoresRepo } from '../repo/quizScores.repo';

export async function processAnswer({
  quizId,
  userId,
  questionId,
  answerId,
}: {
  quizId: string;
  userId: string;
  questionId: string;
  answerId: string;
}) {
  const quizScores = await quizScoresRepo.getByQuizId(quizId);
  if (!quizScores) {
    return { outcome: 'error', message: 'Quiz not found' };
  }

  const currentScore = await quizScoresRepo.updateScore({ quizId, userId, questionId, answerId });
  return { outcome: 'success', currentScore };
}

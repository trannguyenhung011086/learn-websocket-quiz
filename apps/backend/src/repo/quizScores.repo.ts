import { answerScoresRepo } from './answerScores.repo';

// In-memory store for quiz scores (can be replaced by Redis or a database)
type QuizScores = {
  [quizId: string]: {
    [userId: string]: number;
  };
};
const quizScores: QuizScores = {};

export const quizScoresRepo = {
  getByQuizId: async (quizId: string) => {
    if (!quizScores[quizId]) {
      quizScores[quizId] = {};
    }
    return quizScores[quizId];
  },
  updateScore: async ({
    quizId,
    userId,
    questionId,
    answerId,
  }: {
    quizId: string;
    userId: string;
    questionId: string;
    answerId: string;
  }) => {
    if (!quizScores[quizId][userId]) {
      quizScores[quizId][userId] = 0;
    }
    const answerScore = await answerScoresRepo.getScore(questionId, answerId);
    quizScores[quizId][userId] += answerScore;
    return quizScores[quizId][userId];
  },
};

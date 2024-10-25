// In-memory store for quiz answers (can be replaced by a database or CMS)
type QuizMappings = {
  [questionId: string]: {
    [answerId: string]: number;
  };
};
const quizMappings: QuizMappings = {
  question1: { answer1: 0, answer2: 0, answer3: 1 },
  question2: { answer1: 0, answer2: 1, answer3: 0 },
  question3: { answer1: 1, answer2: 0, answer3: 0 },
};

export const answerScoresRepo = {
  getScore: async (questionId: string, answerId: string) => {
    if (!quizMappings[questionId]) {
      return 0;
    }
    return quizMappings[questionId][answerId] ?? 0;
  },
};

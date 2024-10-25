import { Router } from 'express';
import { withAsyncRequestHandling } from '../middlewares/withAsyncRequest';
import { submitAnswerHandler } from './handlers/submitAnswer';

const router = Router();

// Endpoint for submitting quiz answers
router.post('/submit-answer', withAsyncRequestHandling(submitAnswerHandler));

export default router;

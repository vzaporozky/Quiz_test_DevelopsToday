import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
} from '../controllers/quizController';
import { validateQuizData } from '../validation/quizValidation';
import { CreateQuizRequest } from '../types/quiz';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const validatedData = validateQuizData(req.body);
    const quiz = await createQuiz(validatedData as CreateQuizRequest);
    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const quizzes = await getAllQuizzes();
    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const quiz = await getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }
    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteQuiz(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }
    res.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import { prisma } from '../index';
import { CreateQuizRequest, Quiz, QuizListItem } from '../types/quiz';

export const createQuiz = async (data: CreateQuizRequest): Promise<Quiz> => {
  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((question) => ({
          text: question.text,
          type: question.type,
          options: question.options ? JSON.stringify(question.options) : null,
          correctAnswer: question.correctAnswer || null,
        })),
      },
    },
    include: {
      questions: true,
    },
  });

  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type as any,
      options: q.options ? JSON.parse(q.options) : undefined,
      correctAnswer: q.correctAnswer || undefined,
    })),
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
};

export const getAllQuizzes = async (): Promise<QuizListItem[]> => {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return quizzes.map((quiz: any) => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz._count.questions,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  }));
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    return null;
  }

  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type as any,
      options: q.options ? JSON.parse(q.options) : undefined,
      correctAnswer: q.correctAnswer || undefined,
    })),
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
};

export const deleteQuiz = async (id: string): Promise<boolean> => {
  try {
    await prisma.quiz.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

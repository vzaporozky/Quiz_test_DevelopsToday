import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional()
});

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required')
});

export const validateQuizData = (data: unknown) => {
  return createQuizSchema.parse(data);
};

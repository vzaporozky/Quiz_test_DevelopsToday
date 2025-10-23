export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX'
}

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizListItem {
  id: string;
  title: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuizRequest {
  title: string;
  questions: Omit<Question, 'id'>[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

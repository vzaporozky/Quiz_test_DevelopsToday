import axios from 'axios';
import { Quiz, QuizListItem, CreateQuizRequest, ApiResponse } from '@/types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  // Create a new quiz
  createQuiz: async (data: CreateQuizRequest): Promise<Quiz> => {
    const response = await api.post<ApiResponse<Quiz>>('/quizzes', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create quiz');
    }
    return response.data.data;
  },

  // Get all quizzes
  getAllQuizzes: async (): Promise<QuizListItem[]> => {
    const response = await api.get<ApiResponse<QuizListItem[]>>('/quizzes');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch quizzes');
    }
    return response.data.data;
  },

  // Get quiz by ID
  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await api.get<ApiResponse<Quiz>>(`/quizzes/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Quiz not found');
    }
    return response.data.data;
  },

  // Delete quiz
  deleteQuiz: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/quizzes/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete quiz');
    }
  },
};

export default api;

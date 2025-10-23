'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Eye, Calendar, FileText } from 'lucide-react';
import { quizApi } from '@/lib/api';
import { QuizListItem } from '@/types/quiz';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizApi.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      alert('Ошибка при загрузке квизов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот квиз?')) {
      return;
    }

    setDeletingId(id);
    try {
      await quizApi.deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Ошибка при удалении квиза');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка квизов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Все квизы</h1>
        <Link href="/create" className="btn btn-primary">
          Создать новый квиз
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Квизы не найдены
          </h3>
          <p className="text-gray-600 mb-6">
            Создайте свой первый квиз, чтобы начать работу
          </p>
          <Link href="/create" className="btn btn-primary">
            Создать квиз
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {quiz.title}
                </h3>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deletingId === quiz.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  title="Удалить квиз"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{quiz.questionCount} вопросов</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatDate(quiz.createdAt)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Просмотреть
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

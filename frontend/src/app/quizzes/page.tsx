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
      alert('Error loading quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    setDeletingId(id);
    try {
      await quizApi.deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">All Quizzes</h1>
        <Link href="/create" className="btn btn-primary">
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No Quizzes Found
          </h3>
          <p className="mb-6 text-gray-600">
            Create your first quiz to get started
          </p>
          <Link href="/create" className="btn btn-primary">
            Create Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                  {quiz.title}
                </h3>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deletingId === quiz.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  title="Delete quiz"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{quiz.questionCount} questions</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="text-sm">{formatDate(quiz.createdAt)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="btn btn-primary flex flex-1 items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

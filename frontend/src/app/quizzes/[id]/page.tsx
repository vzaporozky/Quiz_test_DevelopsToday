'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Type,
  CheckSquare,
} from 'lucide-react';
import { quizApi } from '@/lib/api';
import { Quiz, QuestionType } from '@/types/quiz';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchQuiz(params.id as string);
    }
  }, [params.id]);

  const fetchQuiz = async (id: string) => {
    try {
      const data = await quizApi.getQuizById(id);
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error loading quiz');
      router.push('/quizzes');
    } finally {
      setLoading(false);
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

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.BOOLEAN:
        return <CheckCircle className="h-5 w-5" />;
      case QuestionType.INPUT:
        return <Type className="h-5 w-5" />;
      case QuestionType.CHECKBOX:
        return <CheckSquare className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.BOOLEAN:
        return 'Yes/No';
      case QuestionType.INPUT:
        return 'Text Answer';
      case QuestionType.CHECKBOX:
        return 'Multiple Choice';
      default:
        return 'Unknown type';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="py-12 text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Quiz Not Found
        </h3>
        <p className="mb-6 text-gray-600">
          The requested quiz does not exist or has been deleted
        </p>
        <Link href="/quizzes" className="btn btn-primary">
          Back to Quiz List
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="mt-2 flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="text-sm">
              Created {formatDate(quiz.createdAt!)}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="card mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <FileText className="mr-2 h-5 w-5" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <Link href="/quizzes" className="btn btn-secondary">
            All Quizzes
          </Link>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>

        {quiz.questions.map((question, index) => (
          <div key={question.id} className="card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center">
                <span className="mr-3 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  Question {index + 1}
                </span>
                <div className="flex items-center text-gray-600">
                  {getQuestionTypeIcon(question.type)}
                  <span className="ml-2 text-sm">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {question.text}
            </h3>

            {/* Question-specific content */}
            {question.type === QuestionType.BOOLEAN && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-600">Correct Answer:</p>
                <div className="flex items-center">
                  {question.correctAnswer === 'true' ? (
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {question.correctAnswer === 'true' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}

            {question.type === QuestionType.INPUT && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-600">Correct Answer:</p>
                <p className="font-medium">{question.correctAnswer}</p>
              </div>
            )}

            {question.type === QuestionType.CHECKBOX && question.options && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-3 text-sm text-gray-600">Answer Options:</p>
                <ul className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="flex items-center">
                      <div className="mr-3 h-4 w-4 rounded border-2 border-gray-300"></div>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

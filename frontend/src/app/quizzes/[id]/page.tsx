'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, CheckCircle, XCircle, Type, CheckSquare } from 'lucide-react';
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
      alert('Ошибка при загрузке квиза');
      router.push('/quizzes');
    } finally {
      setLoading(false);
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

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.BOOLEAN:
        return <CheckCircle className="w-5 h-5" />;
      case QuestionType.INPUT:
        return <Type className="w-5 h-5" />;
      case QuestionType.CHECKBOX:
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.BOOLEAN:
        return 'Да/Нет';
      case QuestionType.INPUT:
        return 'Текстовый ответ';
      case QuestionType.CHECKBOX:
        return 'Множественный выбор';
      default:
        return 'Неизвестный тип';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка квиза...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Квиз не найден
        </h3>
        <p className="text-gray-600 mb-6">
          Запрашиваемый квиз не существует или был удален
        </p>
        <Link href="/quizzes" className="btn btn-primary">
          Вернуться к списку квизов
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Создан {formatDate(quiz.createdAt!)}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <FileText className="w-5 h-5 mr-2" />
            <span>{quiz.questions.length} вопросов</span>
          </div>
          <Link href="/quizzes" className="btn btn-secondary">
            Все квизы
          </Link>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Вопросы</h2>
        
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                  Вопрос {index + 1}
                </span>
                <div className="flex items-center text-gray-600">
                  {getQuestionTypeIcon(question.type)}
                  <span className="ml-2 text-sm">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.text}
            </h3>

            {/* Question-specific content */}
            {question.type === QuestionType.BOOLEAN && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Правильный ответ:</p>
                <div className="flex items-center">
                  {question.correctAnswer === 'true' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className="font-medium">
                    {question.correctAnswer === 'true' ? 'Да' : 'Нет'}
                  </span>
                </div>
              </div>
            )}

            {question.type === QuestionType.INPUT && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Правильный ответ:</p>
                <p className="font-medium">{question.correctAnswer}</p>
              </div>
            )}

            {question.type === QuestionType.CHECKBOX && question.options && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Варианты ответов:</p>
                <ul className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3"></div>
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

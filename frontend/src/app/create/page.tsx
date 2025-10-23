'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save } from 'lucide-react';
import { quizApi } from '@/lib/api';
import { QuestionType } from '@/types/quiz';

const questionSchema = z.object({
  text: z.string().min(1, 'Текст вопроса обязателен'),
  type: z.nativeEnum(QuestionType),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});

const createQuizSchema = z.object({
  title: z.string().min(1, 'Название квиза обязательно'),
  questions: z.array(questionSchema).min(1, 'Добавьте хотя бы один вопрос'),
});

type CreateQuizForm = z.infer<typeof createQuizSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateQuizForm>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          text: '',
          type: QuestionType.BOOLEAN,
          correctAnswer: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  const addQuestion = () => {
    append({
      text: '',
      type: QuestionType.BOOLEAN,
      correctAnswer: '',
    });
  };

  const onSubmit = async (data: CreateQuizForm) => {
    setIsSubmitting(true);
    try {
      await quizApi.createQuiz(data);
      router.push('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Ошибка при создании квиза');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Создать новый квиз
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quiz Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Название квиза
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input"
              placeholder="Введите название квиза"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Вопросы</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить вопрос
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="card p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Вопрос {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Текст вопроса
                    </label>
                    <textarea
                      {...register(`questions.${index}.text`)}
                      className="input min-h-[80px]"
                      placeholder="Введите текст вопроса"
                    />
                    {errors.questions?.[index]?.text && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.questions[index]?.text?.message}
                      </p>
                    )}
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип вопроса
                    </label>
                    <select
                      {...register(`questions.${index}.type`)}
                      className="input"
                    >
                      <option value={QuestionType.BOOLEAN}>Да/Нет</option>
                      <option value={QuestionType.INPUT}>Текстовый ответ</option>
                      <option value={QuestionType.CHECKBOX}>Множественный выбор</option>
                    </select>
                  </div>

                  {/* Conditional fields based on question type */}
                  {watchedQuestions[index]?.type === QuestionType.BOOLEAN && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Правильный ответ
                      </label>
                      <select
                        {...register(`questions.${index}.correctAnswer`)}
                        className="input"
                      >
                        <option value="">Выберите ответ</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                      </select>
                    </div>
                  )}

                  {watchedQuestions[index]?.type === QuestionType.INPUT && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Правильный ответ
                      </label>
                      <input
                        {...register(`questions.${index}.correctAnswer`)}
                        type="text"
                        className="input"
                        placeholder="Введите правильный ответ"
                      />
                    </div>
                  )}

                  {watchedQuestions[index]?.type === QuestionType.CHECKBOX && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Варианты ответов (по одному на строку)
                      </label>
                      <textarea
                        {...register(`questions.${index}.options`)}
                        className="input min-h-[100px]"
                        placeholder="Вариант 1&#10;Вариант 2&#10;Вариант 3"
                        onChange={(e) => {
                          const options = e.target.value
                            .split('\n')
                            .map(opt => opt.trim())
                            .filter(opt => opt.length > 0);
                          // Update the form value
                          e.target.value = options.join('\n');
                        }}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Введите каждый вариант ответа с новой строки
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {errors.questions && (
              <p className="text-sm text-red-600">{errors.questions.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Создание...' : 'Создать квиз'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

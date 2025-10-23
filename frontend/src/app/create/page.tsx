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
  text: z.string().min(1, 'Question text is required'),
  type: z.nativeEnum(QuestionType),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});

const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
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
      alert('Error creating quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="card p-6">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Create New Quiz
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quiz Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Quiz Title
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input"
              placeholder="Enter quiz title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Questions */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="card mb-4 p-4">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Question Text
                    </label>
                    <textarea
                      {...register(`questions.${index}.text`)}
                      className="input min-h-[80px]"
                      placeholder="Enter question text"
                    />
                    {errors.questions?.[index]?.text && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.questions[index]?.text?.message}
                      </p>
                    )}
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Question Type
                    </label>
                    <select
                      {...register(`questions.${index}.type`)}
                      className="input"
                    >
                      <option value={QuestionType.BOOLEAN}>Yes/No</option>
                      <option value={QuestionType.INPUT}>Text Answer</option>
                      <option value={QuestionType.CHECKBOX}>
                        Multiple Choice
                      </option>
                    </select>
                  </div>

                  {/* Conditional fields based on question type */}
                  {watchedQuestions[index]?.type === QuestionType.BOOLEAN && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Correct Answer
                      </label>
                      <select
                        {...register(`questions.${index}.correctAnswer`)}
                        className="input"
                      >
                        <option value="">Select answer</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  )}

                  {watchedQuestions[index]?.type === QuestionType.INPUT && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Correct Answer
                      </label>
                      <input
                        {...register(`questions.${index}.correctAnswer`)}
                        type="text"
                        className="input"
                        placeholder="Enter correct answer"
                      />
                    </div>
                  )}

                  {watchedQuestions[index]?.type === QuestionType.CHECKBOX && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Answer Options (one per line)
                      </label>
                      <textarea
                        {...register(`questions.${index}.options`)}
                        className="input min-h-[100px]"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        onChange={(e) => {
                          const options = e.target.value
                            .split('\n')
                            .map((opt) => opt.trim())
                            .filter((opt) => opt.length > 0);
                          // Update the form value
                          e.target.value = options.join('\n');
                        }}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter each answer option on a new line
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

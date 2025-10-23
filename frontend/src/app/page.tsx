import Link from 'next/link';

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Welcome to Quiz Builder
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Create and manage your quizzes with various question types
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/create" className="btn btn-primary px-8 py-3 text-lg">
            Create New Quiz
          </Link>
          <Link href="/quizzes" className="btn btn-secondary px-8 py-3 text-lg">
            View Quizzes
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="mb-4 text-4xl text-primary-600">📝</div>
          <h3 className="mb-2 text-xl font-semibold">Quiz Creation</h3>
          <p className="text-gray-600">
            Create quizzes with various question types: yes/no, text answers,
            and multiple choice
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="mb-4 text-4xl text-primary-600">📊</div>
          <h3 className="mb-2 text-xl font-semibold">Management</h3>
          <p className="text-gray-600">
            View all your quizzes, edit them, and delete unnecessary ones
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="mb-4 text-4xl text-primary-600">👁️</div>
          <h3 className="mb-2 text-xl font-semibold">Viewing</h3>
          <p className="text-gray-600">
            Study the structure of your quizzes and their questions in detail
          </p>
        </div>
      </div>
    </div>
  );
}

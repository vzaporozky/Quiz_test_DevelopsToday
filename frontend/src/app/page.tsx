import Link from 'next/link';

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Добро пожаловать в Quiz Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Создавайте и управляйте своими квизами с различными типами вопросов
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="btn btn-primary text-lg px-8 py-3"
          >
            Создать новый квиз
          </Link>
          <Link
            href="/quizzes"
            className="btn btn-secondary text-lg px-8 py-3"
          >
            Просмотреть квизы
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-6 text-center">
          <div className="text-primary-600 text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Создание квизов</h3>
          <p className="text-gray-600">
            Создавайте квизы с различными типами вопросов: да/нет, текстовые ответы и множественный выбор
          </p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-primary-600 text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Управление</h3>
          <p className="text-gray-600">
            Просматривайте все ваши квизы, редактируйте их и удаляйте ненужные
          </p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-primary-600 text-4xl mb-4">👁️</div>
          <h3 className="text-xl font-semibold mb-2">Просмотр</h3>
          <p className="text-gray-600">
            Детально изучайте структуру ваших квизов и их вопросы
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage custom quizzes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-primary-600">
                    Quiz Builder
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href="/quizzes"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    All Quizzes
                  </a>
                  <a href="/create" className="btn btn-primary">
                    Create Quiz
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

# Quiz Builder

A full-featured quiz creation platform built with Node.js, Express, React, Next.js, and Docker.

## 🚀 Features

- **Quiz Creation** with various question types:
  - Yes/No (Boolean)
  - Text answers (Input)
  - Multiple choice (Checkbox)
- **Quiz Management** - view, edit, and delete quizzes
- **Detailed View** of quiz structure
- **Modern UI** with Tailwind CSS
- **TypeScript** for type safety
- **Responsive Design** for mobile devices
- **Docker Support** for easy deployment
- **PostgreSQL Database** for production-ready data storage

## 🛠 Technologies

### Backend

- **Node.js 20** with **Express.js**
- **TypeScript** for type safety
- **Prisma** ORM with **PostgreSQL** database
- **Zod** for data validation
- **Docker** for containerization
- **ESLint** and **Prettier** for code quality

### Frontend

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** with **Zod** validation
- **Axios** for HTTP requests
- **Lucide React** for icons

### Infrastructure

- **Docker & Docker Compose** for containerization
- **PostgreSQL 15** for database
- **Multi-stage Docker builds** for optimization

## 📋 Requirements

- **Docker** and **Docker Compose**
- **Node.js 20+** (for local development)
- **npm**

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Quiz

# Create environment file for backend
cp backend/.env.example backend/.env

# Start all services with Docker Compose
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001/api
# - PostgreSQL: localhost:5432
```

### Option 2: Local Development

#### 1. Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

#### 2. Database Setup

```bash
# Navigate to backend folder
cd backend

# Create .env file (you'll need to set up PostgreSQL locally)
cp .env.example .env

# Update DATABASE_URL in .env to point to your PostgreSQL instance
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/quiz_builder"

# Generate Prisma client
npm run db:generate

# Create database and apply schema
npm run db:push
```

#### 3. Run Application

```bash
# Return to root folder
cd ..

# Run backend and frontend simultaneously
npm run dev
```

Or run separately:

```bash
# Backend (port 3001)
npm run dev:backend

# Frontend (port 3000)
npm run dev:frontend
```

## 🌐 Application Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **PostgreSQL**: localhost:5432 (when using Docker)

## 📚 API Endpoints

### Quizzes

- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `DELETE /api/quizzes/:id` - Delete quiz

### Quiz Creation Example

```json
POST /api/quizzes
{
  "title": "JavaScript Test",
  "questions": [
    {
      "text": "Is JavaScript a programming language?",
      "type": "BOOLEAN",
      "correctAnswer": "true"
    },
    {
      "text": "What is the main function called in React?",
      "type": "INPUT",
      "correctAnswer": "component"
    },
    {
      "text": "Which of the following are JavaScript data types?",
      "type": "CHECKBOX",
      "options": ["string", "number", "boolean", "array", "object"]
    }
  ]
}
```

## 🎯 Usage

### Creating a Quiz

1. Navigate to http://localhost:3000/create
2. Enter quiz title
3. Add questions by selecting type:
   - **Yes/No**: Choose correct answer (Yes/No)
   - **Text Answer**: Enter correct answer
   - **Multiple Choice**: Add answer options (one per line)
4. Click "Create Quiz"

### Viewing Quizzes

1. Navigate to http://localhost:3000/quizzes
2. View list of all quizzes
3. Click "View" for detailed view
4. Use delete button to remove quiz

## 🛠 Development

### Docker Commands

```bash
# Start all services
docker compose -f docker-compose.yml up -d --build

# View logs
docker-compose logs -f

# Access backend container
docker-compose exec backend sh

# Access PostgreSQL
docker-compose exec postgres-db psql -U postgres -d quiz_builder
```

### Local Development Commands

```bash
# Install dependencies
npm run install:all

# Run in development mode
npm run dev

# Build for production
npm run build

# Linting (frontend)
cd frontend && npm run lint

# Code formatting (frontend)
cd frontend && npm run format
```

### Database

```bash
# For fixing DB if does not work
docker compose exec backend npx prisma migrate dev --name init

# Generate Prisma client
cd backend && npm run db:generate

# Push schema changes
cd backend && npm run db:push

# Reset database (local development)
cd backend && npm run db:push --force-reset
```

## 🔧 Configuration

### Backend (.env)

```env
DATABASE_URL=
PORT=
NODE_ENV=

POSTGRES_PASSWORD=
POSTGRES_HOST_AUTH_METHOD=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

## 📝 Creating a Sample Quiz

After starting the application, you can create a test quiz:

1. Open http://localhost:3000/create
2. Enter title: "Programming Test"
3. Add several questions of different types
4. Save the quiz
5. View the result in the quiz list

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and start all services
docker compose -f docker-compose.yml up -d --build
```

### Manual Deployment

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

## 📄 License

MIT License

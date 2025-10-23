import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import quizRoutes from './routes/quizRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

export const prisma = new PrismaClient();

app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://quiz-test-develops-today-frontend.vercel.app/',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/quizzes', quizRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

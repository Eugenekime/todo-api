import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import router from './routes/todos.js';
import logRequest from './middleware/logRequest.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB, checkDB } from './config/database.js';

const app = express();

app.use(
  cors({
    origin: 'https://eugenekime.github.io',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logRequest);
app.use('/api', router);
app.get('/health', async (req, res) => {
  const isDBConnected = await checkDB();
  if (!isDBConnected) {
    return res.status(503).json({ status: 'error', database: 'disconnected' });
  }
  return res.json({ status: 'ok', database: 'connected' });
});

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    error: 'Route not found',
    details: [
      {
        field: 'path',
        message: 'The requested route does not exist',
        value: req.originalUrl,
      },
    ],
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT} port`);
    });
  } catch (error) {
    console.log('Something went wrong', error);
    process.exitCode = 1;
  }
}

startServer();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import createTodoRouter from './routes/todos.js';
import logRequest from './middleware/logRequest.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB, checkDB } from './config/database.js';
import { setupSocketHandlers } from './sockets/socketHandlers.js';
import { connectRedis } from './config/redis.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://eugenekime.github.io', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

setupSocketHandlers(io);

app.use(
  cors({
    origin: ['https://eugenekime.github.io', 'http://localhost:5173'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logRequest);
app.use('/api', createTodoRouter(io));
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
    await connectRedis();
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Listening on ${PORT} port`);
    });
  } catch (error) {
    console.log('Something went wrong', error);
    process.exitCode = 1;
  }
}

startServer();

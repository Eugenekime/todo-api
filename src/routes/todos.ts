import { Router } from 'express';
import { Server } from 'socket.io';

import {
  validationCreateTodo,
  validationIdTodo,
  validationQuery,
  validationUpdateTodo,
} from '../middleware/validation.js';
import {
  createTodo,
  deleteTodo,
  getAllTodo,
  getSingleTodo,
  updateTodo,
} from '../controller/controllerTodo.js';

const createTodoRouter = (io: Server) => {
  const router = Router();

  router.get('/todos', validationQuery, getAllTodo);

  router.get('/todos/:id', validationIdTodo, getSingleTodo);

  router.post('/todos', validationCreateTodo, createTodo(io));

  router.put(
    '/todos/:id',
    validationIdTodo,
    validationUpdateTodo,
    updateTodo(io)
  );

  router.delete('/todos/:id', validationIdTodo, deleteTodo(io));

  return router;
};

export default createTodoRouter;

import { Router } from 'express';
import { Server } from 'socket.io';

import {
  validationCreateTodo,
  validationIdTodo,
  validationQuery,
  validationUpdateTodo,
} from '../middleware/validation.js';
import {
  createTodoController,
  deleteTodoController,
  getAllTodoController,
  getSingleTodoController,
  updateTodoController,
} from '../controller/controllerTodo.js';

const createTodoRouter = (io: Server) => {
  const router = Router();

  router.get('/todos', validationQuery, getAllTodoController);

  router.get('/todos/:id', validationIdTodo, getSingleTodoController);

  router.post('/todos', validationCreateTodo, createTodoController(io));

  router.put(
    '/todos/:id',
    validationIdTodo,
    validationUpdateTodo,
    updateTodoController(io)
  );

  router.delete('/todos/:id', validationIdTodo, deleteTodoController(io));

  return router;
};

export default createTodoRouter;

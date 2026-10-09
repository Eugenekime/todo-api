import { Router } from 'express';
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

const router = Router();

router.get('/todos', validationQuery, getAllTodo);
router.get('/todos/:id', validationIdTodo, getSingleTodo);
router.post('/todos', validationCreateTodo, createTodo);
router.put('/todos/:id', validationIdTodo, validationUpdateTodo, updateTodo);
router.delete('/todos/:id', validationIdTodo, deleteTodo);

export default router;

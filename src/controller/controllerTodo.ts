import type { Request, Response, NextFunction } from 'express';
import type { TodoQueryOptions } from '../types/todo.types.js';
import * as serviceTodo from '../service/serviceTodo.js';

async function getAllTodo(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, completed, priority, search, offset, dueFrom, dueTo } =
      req.query;
    const options: TodoQueryOptions = {};

    if (limit !== undefined) {
      options.limit = Number(limit);
    }

    if (completed !== undefined) {
      options.completed = completed === 'true';
    }

    if (priority === 'high' || priority === 'medium' || priority === 'low') {
      options.priority = priority;
    }

    if (typeof search === 'string') {
      options.search = search;
    }

    if (offset !== undefined) {
      options.offset = Number(offset);
    }

    if (typeof dueFrom === 'string') {
      options.dueFrom = dueFrom;
    }

    if (typeof dueTo === 'string') {
      options.dueTo = dueTo;
    }

    const response = await serviceTodo.getAllTodo(options);
    return res.json({
      success: true,
      ...response,
    });
  } catch (error) {
    next(error);
  }
}

async function getSingleTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid id',
    });
  }

  try {
    const data = await serviceTodo.getSingleTodo(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Id request failed',
        details: [
          {
            field: 'id',
            message: 'Cannot find id',
            value: id,
          },
        ],
      });
    }

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

async function createTodo(req: Request, res: Response, next: NextFunction) {
  try {
    const newTodo = await serviceTodo.createTodo(req.body);

    return res.status(201).json({
      success: true,
      message: 'Todo created',
      data: newTodo,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid id',
    });
  }
  try {
    const updatedTodo = await serviceTodo.updateTodo(id, req.body);
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: 'Id request failed',
        details: [
          {
            field: 'id',
            message: 'Cannot found id',
            value: id,
          },
        ],
      });
    }
    return res.status(201).json({
      success: true,
      message: 'Todo updated',
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid id',
    });
  }
  try {
    const isDeleted = serviceTodo.deleteTodo(id);
    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Id request failed',
        details: [
          {
            field: 'id',
            message: 'Cannot found id',
            value: id,
          },
        ],
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export { getAllTodo, createTodo, updateTodo, getSingleTodo, deleteTodo };

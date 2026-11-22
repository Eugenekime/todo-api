import type { Request, Response, NextFunction } from 'express';
import type { TodoQueryOptions } from '../types/todo.types.js';
import type { Server } from 'socket.io';
import { WORKSPACE } from '../sockets/socketHandlers.js';
import * as serviceTodo from '../service/serviceTodo.js';
import { ObjectId } from 'mongodb';

async function getAllTodoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      limit,
      completed,
      priority,
      search,
      offset,
      dueFrom,
      dueTo,
      sortBy,
      order,
    } = req.query;
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

    if (typeof sortBy === 'string') {
      options.sortBy = sortBy;
    }
    if (typeof order === 'string') {
      options.order = order;
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

async function getSingleTodoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid id',
      details: [
        {
          field: 'id',
          message: 'Id must be a valid MongoDB ObjectId',
          value: id,
        },
      ],
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

function createTodoController(io: Server) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTodo = await serviceTodo.createTodo(req.body);
      io.to(WORKSPACE).emit('todo:created', newTodo);
      return res.status(201).json({
        success: true,
        message: 'Todo created',
        data: newTodo,
      });
    } catch (error) {
      next(error);
    }
  };
}

function updateTodoController(io: Server) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid id',
        details: [
          {
            field: 'id',
            message: 'Id must be a valid MongoDB ObjectId',
            value: id,
          },
        ],
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
      io.to(WORKSPACE).emit('todo:updated', updatedTodo);
      return res.status(200).json({
        success: true,
        message: 'Todo updated',
        data: updatedTodo,
      });
    } catch (error) {
      next(error);
    }
  };
}

function deleteTodoController(io: Server) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid id',
        details: [
          {
            field: 'id',
            message: 'Id must be a valid MongoDB ObjectId',
            value: id,
          },
        ],
      });
    }
    try {
      const isDeleted = await serviceTodo.deleteTodo(id);
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
      io.to(WORKSPACE).emit('todo:deleted', { id });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export {
  getAllTodoController,
  createTodoController,
  updateTodoController,
  getSingleTodoController,
  deleteTodoController,
};

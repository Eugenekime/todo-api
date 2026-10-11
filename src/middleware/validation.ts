import type { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

function validationQuery(req: Request, res: Response, next: NextFunction) {
  const { limit, offset, search, completed, priority, dueFrom, dueTo } =
    req.query;

  if (limit !== undefined) {
    if (!Number.isInteger(Number(limit)) || Number(limit) < 1) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'limit',
            message: 'Limit must be a positive integer',
            value: limit,
          },
        ],
      });
    }
  }
  if (offset !== undefined) {
    if (!Number.isInteger(Number(offset)) || Number(offset) < 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'offset',
            message: 'Offset must be a positive integer',
            value: offset,
          },
        ],
      });
    }
  }
  if (search !== undefined) {
    if (typeof search !== 'string' || search.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'search',
            message: 'search must be a string and can not be empty',
            value: search,
          },
        ],
      });
    }
  }
  if (completed !== undefined) {
    if (completed !== 'true' && completed !== 'false') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'completed',
            message: 'Completed must be true or false',
            value: completed,
          },
        ],
      });
    }
  }
  if (priority !== undefined) {
    if (priority !== 'high' && priority !== 'medium' && priority !== 'low') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'priority',
            message: 'priority must be high or low or medium',
            value: priority,
          },
        ],
      });
    }
  }
  if (dueFrom !== undefined && dueTo !== undefined) {
    if (typeof dueFrom === 'string' && typeof dueTo === 'string') {
      const from = new Date(dueFrom);
      const to = new Date(dueTo);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter failed',
          details: [
            {
              field: 'dueFrom or dueTo',
              message: 'DueFrom and dueTo must be a valid date',
              value: {
                dueFrom,
                dueTo,
              },
            },
          ],
        });
      }
      if (from > to) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter failed',
          details: [
            {
              field: 'dueFrom or dueTo',
              message: 'DueFrom must be before or equal to dueTo',
              value: {
                dueFrom,
                dueTo,
              },
            },
          ],
        });
      }
    }
  }
  next();
}

function validationIdTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'id',
          message: 'Id must be positive integer',
          value: id,
        },
      ],
    });
  }
  next();
}

function validationCreateTodo(req: Request, res: Response, next: NextFunction) {
  const { title, description, priority, dueDate } = req.body;
  const allowedFields = ['title', 'description', 'priority', 'dueDate'];
  const unknownFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'body',
          message: 'Unknown fields are not allowed',
          value: unknownFields,
        },
      ],
    });
  }
  if (title === undefined || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'title',
          message: 'Title is required and cannot be empty and must be string',
          value: title,
        },
      ],
    });
  }
  if (
    description === undefined ||
    description.trim() === '' ||
    typeof description !== 'string' ||
    description.length > 300
  ) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'description',
          message: 'Description must be a string and not exceed 300 characters',
          value: description,
        },
      ],
    });
  }
  if (priority !== undefined) {
    if (priority !== 'low' && priority !== 'medium' && priority !== 'high') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'priority',
            message: 'Priority must be only low, medium or high',
            value: priority,
          },
        ],
      });
    }
  }

  if (dueDate !== undefined) {
    const date = new Date(dueDate);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'dueDate',
            message: 'DueDate must be valid date',
            value: dueDate,
          },
        ],
      });
    }
  }

  next();
}

function validationUpdateTodo(req: Request, res: Response, next: NextFunction) {
  const { title, description, priority, dueDate, completed } = req.body;
  const allowedFields = [
    'title',
    'description',
    'priority',
    'dueDate',
    'completed',
  ];
  const unknownFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'body',
          message: 'Unknown fields are not allowed',
          value: unknownFields,
        },
      ],
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'title',
            message: 'Title cannot be empty and must be string',
            value: title,
          },
        ],
      });
    }
  }
  if (description !== undefined) {
    if (
      description.trim() === '' ||
      typeof description !== 'string' ||
      description.length > 300
    ) {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'description',
            message:
              'Description must be a string and not exceed 300 characters',
            value: description,
          },
        ],
      });
    }
  }

  if (priority !== undefined) {
    if (priority !== 'low' && priority !== 'medium' && priority !== 'high') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'priority',
            message: 'Priority must be only low, medium or high',
            value: priority,
          },
        ],
      });
    }
  }

  if (dueDate !== undefined) {
    const date = new Date(dueDate);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'dueDate',
            message: 'DueDate must be valid date',
            value: dueDate,
          },
        ],
      });
    }
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'completed',
            message: 'Completed must be a boolean (true or false)',
            value: completed,
          },
        ],
      });
    }
  }

  next();
}

export {
  validationQuery,
  validationCreateTodo,
  validationUpdateTodo,
  validationIdTodo,
};

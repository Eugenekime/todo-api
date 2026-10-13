import type { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

function validationQuery(req: Request, res: Response, next: NextFunction) {
  const {
    limit,
    offset,
    search,
    completed,
    priority,
    dueFrom,
    dueTo,
    sortBy,
    order,
  } = req.query;

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

  if (sortBy !== undefined && sortBy !== 'dueDate' && sortBy !== 'createdAt') {
    return res.status(400).json({
      success: false,
      error: 'Query parameter failed',
      details: [
        {
          field: 'sortBy',
          message: 'SortBy can be dueDate or createdAt',
          value: sortBy,
        },
      ],
    });
  }

  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    return res.status(400).json({
      success: false,
      error: 'Query parameter failed',
      details: [
        {
          field: 'order',
          message: 'Order can be asc or desc',
          value: order,
        },
      ],
    });
  }

  if (sortBy === undefined && order !== undefined) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter failed',
      details: [
        {
          field: 'order',
          message: 'The order parameter requires sortBy',
          value: order,
        },
      ],
    });
  }
  if (dueFrom !== undefined) {
    if (typeof dueFrom === 'string') {
      const from = new Date(dueFrom);
      if (isNaN(from.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter failed',
          details: [
            {
              field: 'dueFrom',
              message: 'DueFrom must be a valid date',
              value: dueFrom,
            },
          ],
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'dueFrom',
            message: 'The DueFrom parameter must be a string',
            value: dueFrom,
          },
        ],
      });
    }
  }
  if (dueTo !== undefined) {
    if (typeof dueTo === 'string') {
      const to = new Date(dueTo);
      if (isNaN(to.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter failed',
          details: [
            {
              field: 'dueTo',
              message: 'DueTo must be a valid date',
              value: dueTo,
            },
          ],
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Query parameter failed',
        details: [
          {
            field: 'dueTo',
            message: 'The DueTo parameter must be a string',
            value: dueTo,
          },
        ],
      });
    }
  }
  if (dueFrom !== undefined && dueTo !== undefined) {
    const from = new Date(dueFrom);
    const to = new Date(dueTo);

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
          message: 'Id must be a valid MongoDB ObjectId',
          value: id,
        },
      ],
    });
  }
  next();
}

function validationCreateTodo(req: Request, res: Response, next: NextFunction) {
  if (
    req.body === undefined ||
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'body',
          message: 'Request body must be an object',
          value: req.body,
        },
      ],
    });
  }
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
  if (
    title === undefined ||
    typeof title !== 'string' ||
    title.trim() === '' ||
    title.length > 150
  ) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'title',
          message:
            'Title is required and cannot be empty, must be string and not exceed 150 characters',
          value: title,
        },
      ],
    });
  }
  if (
    description === undefined ||
    typeof description !== 'string' ||
    description.trim() === '' ||
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

  if (dueDate !== undefined && dueDate !== null) {
    if (typeof dueDate !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'dueDate',
            message: 'DueDate must be a string or null',
            value: dueDate,
          },
        ],
      });
    }
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
  if (
    req.body === undefined ||
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'body',
          message: 'Request body must be an object',
          value: req.body,
        },
      ],
    });
  }
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

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Body request failed',
      details: [
        {
          field: 'body',
          message: 'At least one field must be provided for update',
        },
      ],
    });
  }

  if (title !== undefined) {
    if (
      typeof title !== 'string' ||
      title.trim() === '' ||
      title.length > 150
    ) {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'title',
            message:
              'Title cannot be empty, must be string and not exceed 150 characters',
            value: title,
          },
        ],
      });
    }
  }
  if (description !== undefined) {
    if (
      typeof description !== 'string' ||
      description.trim() === '' ||
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

  if (dueDate !== undefined && dueDate !== null) {
    if (typeof dueDate !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Body request failed',
        details: [
          {
            field: 'dueDate',
            message: 'DueDate must be a string or null',
            value: dueDate,
          },
        ],
      });
    }
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

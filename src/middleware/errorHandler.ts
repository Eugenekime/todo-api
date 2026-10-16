import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (
    err instanceof SyntaxError &&
    'body' in err &&
    'status' in err &&
    err.status === 400
  ) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      details: [
        {
          field: 'body',
          message: 'Request body must contain valid JSON',
        },
      ],
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details,
    });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      error: 'Invalid value',
      details: [
        {
          field: err.path,
          message: err.message,
        },
      ],
    });
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: 'Document not found',
    });
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate value',
      message: 'A document with this value already exists',
    });
  }
  console.error(err);

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export default errorHandler;

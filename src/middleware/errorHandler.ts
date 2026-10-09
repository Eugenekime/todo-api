import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export default errorHandler;

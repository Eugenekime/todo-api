import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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

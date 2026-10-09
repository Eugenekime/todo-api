import type { Request, Response, NextFunction } from 'express';

function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}

export default logRequest;

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        messasge: 'Invalid token',
        data: null,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY!) as JWTPayload;

    (req as any).user = decode;
    next();
  } catch (error) {
    console.log('error harus login = ', error);
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      messasge: 'Invalid or expired token',
      data: null,
    });
  }
};

import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET_KEY as string) as any;
};

export const accessCookie = {
  httpOnly: true,
  secure: config.isProd, // true kalau HTTPS
  sameSite: 'lax' as const,
  path: '/', // akses untuk semua path
  maxAge: config.ACCESS_EXPIRES_MS,
};

export const refreshCookie = {
  httpOnly: true,
  secure: config.isProd,
  sameSite: 'lax' as const,
  path: '/refresh', // batasi hanya route refresh
  maxAge: config.REFRESH_EXPIRES_MS,
};

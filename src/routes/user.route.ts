import { Router } from 'express';
import { getProfile, login, logout, refreshToken, register } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/refresh', refreshToken);
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.post('/logout', authMiddleware, logout);

export default userRouter;

import { Router } from 'express';
import userRouter from './user.route';
import financeRouter from './finance.routes';
import { verfiyAuth } from '../controllers/user.controller';
import summaryRouter from './summary.route';
import { authMiddleware } from '../middlewares/auth';

const mainRouter = Router();

// verify auth
mainRouter.get('/auth/verify', authMiddleware, verfiyAuth);

// route from other domain
mainRouter.use('/user', userRouter);
mainRouter.use('/finance', financeRouter);
mainRouter.use('/summary', summaryRouter);

export default mainRouter;

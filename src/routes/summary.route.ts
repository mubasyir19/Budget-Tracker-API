import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getSummary } from '../controllers/summary.controller';

const summaryRouter = Router();

summaryRouter.get('/', authMiddleware, getSummary);

export default summaryRouter;

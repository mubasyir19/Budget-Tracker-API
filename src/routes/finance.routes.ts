import { Router } from 'express';
import { addNewTransaction, deleteTransaction, getAllTransaction } from '../controllers/finance.controller';
import { authMiddleware } from '../middlewares/auth';

const financeRouter = Router();

financeRouter.get('/all', authMiddleware, getAllTransaction);
financeRouter.post('/add', authMiddleware, addNewTransaction);
financeRouter.delete('/delete/:id', authMiddleware, deleteTransaction);

export default financeRouter;

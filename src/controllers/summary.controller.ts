import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const totalIncome = await prisma.finance.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, type: 'income' },
    });

    const totalExpense = await prisma.finance.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, type: 'expense' },
    });

    const income = totalIncome._sum.amount || 0;
    const expense = totalExpense._sum.amount || 0;

    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Successfully get data transactions',
      data: {
        balance: income - expense,
        totalIncome: income,
        totalExpense: expense,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      data: null,
    });
  }
};

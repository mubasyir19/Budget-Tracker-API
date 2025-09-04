import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

export const getAllTransaction = async (req: Request, res: Response) => {
  try {
    const userProfile = (req as any).user?.id;
    if (!userProfile) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
        data: null,
      });
    }

    const transactions = await prisma.finance.findMany({
      where: {
        user_id: userProfile,
      },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        code: 'SUCCESS',
        message: 'Empty data',
        data: [],
      });
    }

    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Successfully get data transactions',
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      data: null,
    });
  }
};

export const addNewTransaction = async (req: Request, res: Response) => {
  const { description, amount, type, category, transaction_date } = req.body;
  const userProfile = (req as any).user?.id;
  if (!userProfile) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'User not authenticated',
      data: null,
    });
  }

  try {
    if (!description || !amount || !type || !category || !transaction_date) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Description, price, type, category, dateTransaction are required',
        data: null,
      });
    }

    const parsedDate = new Date(transaction_date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const newTransaction = await prisma.finance.create({
      data: {
        description,
        user_id: userProfile,
        amount: parseInt(amount),
        type,
        category,
        transaction_date: parsedDate.toISOString(),
        // transaction_date: new Date(transaction_date).toISOString(),
      },
    });

    return res.status(201).json({
      code: 'CREATED',
      message: 'Successfully add new transaction',
      data: newTransaction,
    });
  } catch (error) {
    console.log('error tambah finance = ', error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      data: null,
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'ID is required',
        data: null,
      });
    }

    const existing = await prisma.finance.findFirst({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Data not found',
        data: null,
      });
    }

    await prisma.finance.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Data successfully deleted',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      data: null,
    });
  }
};

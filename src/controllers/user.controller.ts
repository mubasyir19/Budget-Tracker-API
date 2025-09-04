import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { accessCookie, refreshCookie, signAccessToken, signRefreshToken, verifyToken } from '../utils/token';
import { config } from '../config';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const findUser = await prisma.user.findFirst({
      where: { username },
    });
    if (!findUser) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        messasge: 'User not found',
        data: null,
      });
    }

    const checkPassword = bcrypt.compareSync(password, findUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        messasge: 'Invalid password',
        data: null,
      });
    }

    const user = {
      id: findUser.id,
      fullname: findUser.fullname,
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    };

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refresh_token_hash: refreshTokenHash,
        refresh_token_expiry: new Date(Date.now() + config.REFRESH_EXPIRES_MS),
      },
    });

    res.cookie('accessToken', accessToken, accessCookie);
    res.cookie('refreshToken', refreshToken, refreshCookie);

    return res.status(200).json({
      code: 'SUCCESS',
      messasge: 'Login successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      messasge: 'Something went wrong',
      data: null,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const { fullname, email, username, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({
      code: 'CREATED',
      messasge: 'A new account successfully created',
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      messasge: 'Something went wrong',
      data: null,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        messasge: 'Missing access token',
        data: null,
      });
    }

    const claims = verifyToken(accessToken);
    if (!claims) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        messasge: 'Invalid token',
        data: null,
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: claims.id },
      select: {
        id: true,
        fullname: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        messasge: 'User not found',
        data: null,
      });
    }

    return res.status(200).json({
      code: 'SUCCESS',
      messasge: 'User profile',
      data: user,
    });
  } catch (error) {
    console.log('error get profile = ', error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      messasge: 'Something went wrong',
      data: null,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        messasge: 'Missing access token',
        data: null,
      });
    }

    const claims = verifyToken(accessToken);
    // console.log('ini claims = ', claims);
    if (!claims) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        messasge: 'Invalid token',
        data: null,
      });
    }

    await prisma.user.update({
      where: { id: claims.id },
      data: {
        refresh_token_hash: null,
        refresh_token_expiry: new Date(),
      },
    });

    res.clearCookie('accessToken', { ...accessCookie, maxAge: 0 });
    res.clearCookie('refreshToken', { ...refreshCookie, maxAge: 0 });
    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Logged out',
      data: null,
    });
  } catch (error) {
    // console.log('error logout = ', error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      messasge: 'Something went wrong',
      data: null,
    });
  }
};

export const verfiyAuth = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.session;
    if (!token) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Missing access token',
        data: null,
      });
    }

    const claims = verifyToken(token);
    if (!claims) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.id },
      select: {
        id: true,
        fullname: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'User not found',
        data: null,
      });
    }

    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Token valid',
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      data: null,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refresh = req.cookies?.refresh;
  if (!refresh) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Missing refresh token',
      data: null,
    });
  }

  try {
    const claims = verifyToken(refresh);
    const newAccess = signAccessToken({
      id: claims.fullname,
      fullname: claims.fullname,
      username: claims.username,
      email: claims.email,
      role: claims.role,
    });

    res.cookie('session', newAccess, accessCookie);
    res.status(200).json({
      code: 'SUCCESS',
      message: 'Access token refreshed',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      messasge: 'Something went wrong',
      data: null,
    });
  }
};

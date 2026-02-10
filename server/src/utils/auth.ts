import jwt from 'jsonwebtoken';
import type { Response } from 'express';

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        path: '/api/auth/refresh',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

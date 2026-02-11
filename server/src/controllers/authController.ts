import type { Request, Response } from 'express';
import { User, type IUser } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from '../utils/auth.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ email, password });
        await user.save();

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        sendRefreshToken(res, refreshToken);

        res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        sendRefreshToken(res, refreshToken);
        res.json({ accessToken, user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ accessToken: '' });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

        if (!payload.userId) return res.status(401).json({ accessToken: '' });

        const user = await User.findById(payload.userId);
        if (!user) return res.status(401).json({ accessToken: '' });

        const accessToken = generateAccessToken(user._id.toString());
        res.json({ accessToken, user: { id: user._id, email: user.email } });
    } catch (err) {
        return res.status(401).json({ accessToken: '' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        path: '/api/auth/refresh',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out' });
};

export const me = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.userId) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

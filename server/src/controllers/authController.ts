import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from '../utils/auth.js';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await (user as any).comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        sendRefreshToken(res, refreshToken);
        res.json({ accessToken, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ accessToken: '' });

    let payload: any = null;
    try {
        payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
        return res.status(401).json({ accessToken: '' });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ accessToken: '' });

    const accessToken = generateAccessToken(user._id.toString());
    res.json({ accessToken, user: { id: user._id, email: user.email } });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.json({ message: 'Logged out' });
};

export const me = async (req: any, res: Response) => {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
};

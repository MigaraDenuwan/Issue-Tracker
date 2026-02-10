import express, { type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(morgan(isProduction ? 'combined' : 'dev'));

const getClientUrl = () => {
    if (process.env.CLIENT_URL) {
        return process.env.CLIENT_URL.replace(/\/$/, '');
    }
    return '';
};

const allowedOrigins = [
    getClientUrl(),
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || !isProduction) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        env: process.env.NODE_ENV,
        timestamps: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Issue Tracker API',
        status: 'running',
        env: process.env.NODE_ENV
    });
});

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;

        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';

        await mongoose.connect(uri);
        console.log(`Connected to MongoDB: ${isProduction ? 'Atlas' : 'Local'}`);
    } catch (err: any) {
        console.error('MongoDB connection error:', err);
        if (isProduction) process.exit(1);
    }
};

connectDB();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Error] ${err.message}`);
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: isProduction ? null : err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Allowed CORS Origins:`, allowedOrigins);
});

export default app;

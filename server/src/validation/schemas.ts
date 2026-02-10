import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const issueSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    severity: z.enum(['Minor', 'Major', 'Critical']).optional()
});

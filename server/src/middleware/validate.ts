import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error: any) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.errors.map((e: any) => ({ path: e.path, message: e.message }))
        });
    }
};

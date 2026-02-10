import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { Issue, IssueStatus } from '../models/Issue.js';
import mongoose from 'mongoose';

export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = new Issue({
            ...req.body,
            createdBy: req.user!.userId
        });
        await issue.save();
        res.status(201).json(issue);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getIssues = async (req: AuthRequest, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            q,
            status,
            priority,
            severity,
            sortBy = 'updatedAt',
            sortOrder = 'desc'
        } = req.query as any;

        const query: any = { createdBy: req.user!.userId };

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (severity) query.severity = severity;

        const skip = (Number(page) - 1) * Number(limit);

        const issues = await Issue.find(query)
            .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Issue.countDocuments(query);

        res.json({
            issues,
            total,
            pages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getIssueById = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findOne({ _id: req.params.id, createdBy: req.user!.userId });
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json(issue);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user!.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json(issue);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.userId });
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json({ message: 'Issue deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findOne({ _id: req.params.id, createdBy: req.user!.userId });

        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        if (status === IssueStatus.CLOSED && issue.status !== IssueStatus.RESOLVED && issue.status !== IssueStatus.CLOSED) {
            return res.status(400).json({ message: 'Issue must be resolved before closing' });
        }

        issue.status = status;
        await issue.save();
        res.json(issue);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await Issue.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.user!.userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const result = {
            Open: 0,
            'In Progress': 0,
            Resolved: 0,
            Closed: 0
        };

        stats.forEach(stat => {
            (result as any)[stat._id] = stat.count;
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

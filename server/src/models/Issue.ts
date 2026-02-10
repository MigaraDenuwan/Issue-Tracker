import mongoose, { Schema, type Document } from 'mongoose';

export enum IssueStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
    CLOSED = 'Closed'
}

export enum IssuePriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export enum IssueSeverity {
    MINOR = 'Minor',
    MAJOR = 'Major',
    CRITICAL = 'Critical'
}

export interface IIssue extends Document {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    severity: IssueSeverity;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const issueSchema = new Schema<IIssue>({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(IssueStatus),
        default: IssueStatus.OPEN
    },
    priority: {
        type: String,
        enum: Object.values(IssuePriority),
        default: IssuePriority.MEDIUM
    },
    severity: {
        type: String,
        enum: Object.values(IssueSeverity),
        default: IssueSeverity.MINOR
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Issue = mongoose.model('Issue', issueSchema);

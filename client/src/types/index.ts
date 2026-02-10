export interface User {
    id: string;
    email: string;
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High';
export type IssueSeverity = 'Minor' | 'Major' | 'Critical';

export interface Issue {
    _id: string;
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    severity: IssueSeverity;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface IssuesResponse {
    issues: Issue[];
    total: number;
    pages: number;
    currentPage: number;
}

export interface IssueStats {
    Open: number;
    'In Progress': number;
    Resolved: number;
    Closed: number;
}

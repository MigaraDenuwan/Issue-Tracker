import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetIssuesQuery, useGetStatsQuery } from '../api/apiEndpoints';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from '../components/Button';
import { Select } from '../components/Input';
import { Badge } from '../components/Badge';
import {
    Search,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight,
    Shield,
    Clock
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner';

export const IssuesPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy] = useState('updatedAt');

    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading } = useGetIssuesQuery({
        page,
        q: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        limit: 10
    });

    const { data: stats } = useGetStatsQuery();

    const handleExport = (exportFormat: 'csv' | 'json') => {
        if (!data?.issues) return;

        let content = '';
        let fileName = `issues-export-${new Date().toISOString()}`;

        if (exportFormat === 'csv') {
            const headers = ['Title', 'Status', 'Priority', 'Severity', 'Created At'];
            const rows = data.issues.map(i => [
                i.title, i.status, i.priority, i.severity, i.createdAt
            ]);
            content = [headers, ...rows].map(r => r.join(',')).join('\n');
            fileName += '.csv';
        } else {
            content = JSON.stringify(data.issues, null, 2);
            fileName += '.json';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported to ${exportFormat.toUpperCase()}`);
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'Open': return 'info';
            case 'In Progress': return 'warning';
            case 'Resolved': return 'success';
            case 'Closed': return 'neutral';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
                    <p className="text-zinc-400">Manage and track your project issues</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-zinc-400 uppercase">Open</span>
                        <span className="text-lg font-bold">{stats?.Open || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium text-zinc-400 uppercase">Active</span>
                        <span className="text-lg font-bold">{stats?.['In Progress'] || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-400 uppercase">Solved</span>
                        <span className="text-lg font-bold">{stats?.Resolved || 0}</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        className="w-full bg-zinc-900 border border-white/5 focus:border-blue-500/50 outline-none pl-10 pr-4 py-2.5 rounded-xl transition-all placeholder:text-zinc-600"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        className="w-[140px] py-2 h-11"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </Select>

                    <Select
                        className="w-[140px] py-2 h-11"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => handleExport('csv')} title="Export CSV" className="h-11 w-11">
                        <Download size={18} />
                    </Button>

                    <Button onClick={() => navigate('/issues/new')} className="h-11">
                        <Plus size={18} className="mr-2" />
                        New Issue
                    </Button>
                </div>
            </div>

            {/* Issue Table */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-zinc-500 text-sm">
                                <th className="px-6 py-4 font-medium">Issue</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Priority</th>
                                <th className="px-6 py-4 font-medium">Updated</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-6 h-16 bg-white/5 mb-2 rounded-lg" />
                                    </tr>
                                ))
                            ) : data?.issues.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No issues found match your filters.
                                    </td>
                                </tr>
                            ) : (
                                data?.issues.map((issue) => (
                                    <tr
                                        key={issue._id}
                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => navigate(`/issues/${issue._id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${issue.priority === 'High' ? 'bg-red-500' : 'bg-blue-500 opacity-20'}`} />
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                        {issue.title}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">
                                                        {issue.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield size={14} className={issue.priority === 'High' ? 'text-red-500' : 'text-zinc-500'} />
                                                <span className={issue.priority === 'High' ? 'text-red-500' : 'text-zinc-300'}>{issue.priority}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Clock size={14} />
                                                {formatDate(new Date(issue.updatedAt), 'MMM d, h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/issues/${issue._id}`);
                                            }}>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.pages > 1 && (
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                        <p className="text-sm text-zinc-500">
                            Showing <span className="text-white font-medium">{data.issues.length}</span> of <span className="text-white font-medium">{data.total}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm font-medium px-4">Page {page} of {data.pages}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page === data.pages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

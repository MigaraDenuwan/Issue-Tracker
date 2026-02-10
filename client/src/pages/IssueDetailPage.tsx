import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetIssueQuery,
    useDeleteIssueMutation,
    useUpdateIssueStatusMutation
} from '../api/apiEndpoints';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
    ChevronLeft,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Shield,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const IssueDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: issue, isLoading } = useGetIssueQuery(id as string);
    const [deleteIssue] = useDeleteIssueMutation();
    const [updateStatus] = useUpdateIssueStatusMutation();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);

    const handleDelete = async () => {
        try {
            await deleteIssue(id as string).unwrap();
            toast.success('Issue deleted');
            navigate('/issues');
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to delete');
        }
    };

    const handleStatusUpdate = async (status: string) => {
        try {
            await updateStatus({ id: id as string, status }).unwrap();
            toast.success(`Issue marked as ${status}`);
            setStatusToUpdate(null);
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to update status');
            setStatusToUpdate(null);
        }
    };

    if (isLoading) return <div className="p-8 text-center uppercase tracking-widest text-zinc-600">Loading Detail...</div>;
    if (!issue) return <div className="p-8 text-center">Issue not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/issues')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <ChevronLeft size={18} />
                    Back to list
                </button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/issues/${id}/edit`)}>
                        <Edit2 size={16} className="mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => setIsDeleteModalOpen(true)}>
                        <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 md:p-12 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant={issue.status === 'Resolved' ? 'success' : 'info'}>{issue.status}</Badge>
                            <Badge variant={issue.priority === 'High' ? 'error' : 'warning'}>{issue.priority}</Badge>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">{issue.title}</h1>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                            {issue.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={12} /> Severity
                            </p>
                            <p className="text-sm font-semibold">{issue.severity}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={12} /> Created
                            </p>
                            <p className="text-sm font-semibold">{format(new Date(issue.createdAt), 'MMMM d, yyyy')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Clock size={12} /> Last Updated
                            </p>
                            <p className="text-sm font-semibold">{format(new Date(issue.updatedAt), 'MMMM d, yyyy HH:mm')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] p-8 flex items-center justify-between border-t border-white/5">
                    <p className="text-sm text-zinc-500 italic">ID: {issue._id}</p>
                    <div className="flex gap-3">
                        {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                            <Button variant="primary" onClick={() => setStatusToUpdate('Resolved')}>
                                <CheckCircle size={18} className="mr-2" /> Mark Resolved
                            </Button>
                        )}
                        {issue.status === 'Resolved' && (
                            <Button variant="secondary" onClick={() => setStatusToUpdate('Closed')}>
                                <XCircle size={18} className="mr-2" /> Mark Closed
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-zinc-400 text-center py-4">
                        Are you sure you want to delete <span className="text-white font-bold">"{issue.title}"</span>?<br />
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete Permanently</Button>
                    </div>
                </div>
            </Modal>

            {/* Status Update Confirmation Modal */}
            <Modal
                isOpen={!!statusToUpdate}
                onClose={() => setStatusToUpdate(null)}
                title={`Confirm Status: ${statusToUpdate}`}
            >
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-blue-500" size={32} />
                    </div>
                    <p className="text-zinc-400">
                        Do you want to mark this issue as <span className="text-white font-bold">"{statusToUpdate}"</span>?
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" className="flex-1" onClick={() => setStatusToUpdate(null)}>Go Back</Button>
                        <Button variant="primary" className="flex-1" onClick={() => statusToUpdate && handleStatusUpdate(statusToUpdate)}>Confirm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

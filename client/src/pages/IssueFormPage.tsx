import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateIssueMutation, useUpdateIssueMutation, useGetIssueQuery } from '../api/apiEndpoints';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import type { IssueStatus, IssuePriority, IssueSeverity } from '../types';

export const IssueFormPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Open' as IssueStatus,
        priority: 'Medium' as IssuePriority,
        severity: 'Minor' as IssueSeverity
    });

    const { data: issue, isLoading: isFetching } = useGetIssueQuery(id as string, { skip: !isEdit });
    const [createIssue, { isLoading: isCreating }] = useCreateIssueMutation();
    const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();

    useEffect(() => {
        if (issue) {
            setFormData({
                title: issue.title,
                description: issue.description,
                status: issue.status,
                priority: issue.priority,
                severity: issue.severity
            });
        }
    }, [issue]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateIssue({ id: id as string, body: formData }).unwrap();
                toast.success('Issue updated successfully');
            } else {
                await createIssue(formData).unwrap();
                toast.success('Issue created successfully');
            }
            navigate('/issues');
        } catch (err: any) {
            toast.error(err.data?.message || 'Action failed');
        }
    };

    if (isEdit && isFetching) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
                <ChevronLeft size={18} />
                Back
            </button>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEdit ? 'Edit Issue' : 'Create New Issue'}
                </h1>
                <p className="text-zinc-400">
                    {isEdit ? 'Update the details of your issue' : 'Fill in the details for the new issue'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/30 border border-white/5 p-8 rounded-2xl">
                <Input
                    label="Title"
                    placeholder="Issue title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Description</label>
                    <textarea
                        className="w-full bg-zinc-900 border border-white/10 focus:border-blue-500/50 outline-none px-4 py-3 rounded-lg transition-all h-32 text-white placeholder:text-zinc-600"
                        placeholder="Detailed description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as IssuePriority })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Select>

                    <Select
                        label="Severity"
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as IssueSeverity })}
                    >
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Critical">Critical</option>
                    </Select>
                </div>

                {isEdit && (
                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as IssueStatus })}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </Select>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" type="button" onClick={() => navigate('/issues')}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isCreating || isUpdating}>
                        {isEdit ? 'Save Changes' : 'Create Issue'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

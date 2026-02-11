import { apiSlice } from './apiSlice';
import type { User, Issue, IssuesResponse, IssueStats } from '../types';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ accessToken: string; user: User }, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<{ accessToken: string; user: User }, any>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const issuesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIssues: builder.query<IssuesResponse, any>({
            query: (params) => ({
                url: '/issues',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.issues.map(({ _id }) => ({ type: 'Issue' as const, id: _id })),
                        { type: 'Issue', id: 'LIST' },
                    ]
                    : [{ type: 'Issue', id: 'LIST' }],
        }),
        getIssue: builder.query<Issue, string>({
            query: (id) => `/issues/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
        }),
        createIssue: builder.mutation<Issue, Partial<Issue>>({
            query: (body) => ({
                url: '/issues',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Issue', id: 'LIST' }, { type: 'Stats' }],
        }),
        updateIssue: builder.mutation<Issue, { id: string; body: Partial<Issue> }>({
            query: ({ id, body }) => ({
                url: `/issues/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Issue', id },
                { type: 'Issue', id: 'LIST' },
                { type: 'Stats' },
            ],
        }),
        deleteIssue: builder.mutation<void, string>({
            query: (id) => ({
                url: `/issues/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Issue', id: 'LIST' }, { type: 'Stats' }],
        }),
        updateIssueStatus: builder.mutation<Issue, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/issues/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Issue', id },
                { type: 'Issue', id: 'LIST' },
                { type: 'Stats' },
            ],
        }),
        getStats: builder.query<IssueStats, void>({
            query: () => '/issues/stats',
            providesTags: ['Stats'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;
export const {
    useGetIssuesQuery,
    useGetIssueQuery,
    useCreateIssueMutation,
    useUpdateIssueMutation,
    useDeleteIssueMutation,
    useUpdateIssueStatusMutation,
    useGetStatsQuery,
} = issuesApiSlice;

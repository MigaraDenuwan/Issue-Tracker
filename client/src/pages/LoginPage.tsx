import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useLoginMutation } from '../api/apiEndpoints';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials(result));
            toast.success('Logged in successfully');
            navigate('/issues');
        } catch (err: any) {
            toast.error(err.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <img src="/logo.png" alt="Logo" className="w-auto h-100 mb-4 mx-auto" />
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-zinc-400">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-zinc-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

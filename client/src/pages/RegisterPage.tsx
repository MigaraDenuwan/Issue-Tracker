import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../api/apiEndpoints';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ email, password }).unwrap();
            toast.success('Registration successful. Please log in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <img src="/logo.png" alt="Logo" className="w-auto h-100 mb-4 mx-auto" />
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-zinc-400">Get started with IssueTracker today</p>
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
                        Register
                    </Button>
                </form>

                <p className="text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-medium text-zinc-400">{label}</label>}
            <input
                className={`w-full bg-zinc-900 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none px-4 py-2.5 rounded-lg transition-all placeholder:text-zinc-600 text-white ${className} ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : ''}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className, children, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-medium text-zinc-400">{label}</label>}
            <select
                className={`w-full bg-zinc-900 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none px-4 py-2.5 rounded-lg transition-all text-white appearance-none cursor-pointer ${className}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

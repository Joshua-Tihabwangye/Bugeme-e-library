import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../../lib/api/auth';
const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
});
const ForgotPasswordPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = handleSubmit(async (values) => {
        setIsLoading(true);
        try {
            await requestPasswordReset(values.email);
            setIsSubmitted(true);
            toast.success('Check your email for the reset code');
            // Navigate to reset code page after 2 seconds
            setTimeout(() => {
                navigate('/reset-code', { state: { email: values.email } });
            }, 2000);
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to send reset code. Please try again.';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    });
    if (isSubmitted) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Check your email" }), _jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["We've sent a verification code to ", _jsx("span", { className: "font-semibold", children: getValues('email') })] })] }), _jsx("div", { className: "rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/50", children: _jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["Please check your email and enter the 6-digit code to reset your password.", _jsx("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: " The code expires in 2 minutes." })] }) }), _jsx(Link, { to: "/login", className: "block text-center text-sm font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Back to Login" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Forgot Password?" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Enter your email address and we'll send you a code to reset your password." })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Email" }), _jsx("input", { type: "email", ...register('email'), placeholder: "your.email@bugema.ac.ug", disabled: isLoading, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), errors.email && _jsx("p", { className: "text-xs text-red-400", children: errors.email.message })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: isLoading, children: isLoading ? 'Sending...' : 'Send Reset Code' })] }), _jsxs("p", { className: "text-center text-sm text-slate-600 dark:text-slate-400", children: ["Remember your password?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Sign in" })] })] }));
};
export default ForgotPasswordPage;

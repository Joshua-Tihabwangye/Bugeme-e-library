import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { completePasswordReset } from '../../lib/api/auth';
const schema = z
    .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
const NewPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { email, code } = location.state || {};
    // Redirect if no email/code in state
    useEffect(() => {
        if (!email || !code) {
            navigate('/forgot-password');
        }
    }, [email, code, navigate]);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = handleSubmit(async (values) => {
        if (!email || !code)
            return;
        setIsLoading(true);
        try {
            await completePasswordReset(email, code, values.password);
            toast.success('Password reset successfully! You can now login.');
            navigate('/login');
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Set New Password" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Enter your new password below." })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "New Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', ...register('password'), placeholder: "Enter new password", disabled: isLoading, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-[18px] text-slate-400 hover:text-slate-600 dark:hover:text-white", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), errors.password && _jsx("p", { className: "text-xs text-red-400", children: errors.password.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showConfirmPassword ? 'text' : 'password', ...register('confirmPassword'), placeholder: "Confirm new password", disabled: isLoading, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-[18px] text-slate-400 hover:text-slate-600 dark:hover:text-white", children: showConfirmPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), errors.confirmPassword && _jsx("p", { className: "text-xs text-red-400", children: errors.confirmPassword.message })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: isLoading, children: isLoading ? 'Resetting...' : 'Reset Password' })] }), _jsxs("p", { className: "text-center text-sm text-slate-600 dark:text-slate-400", children: ["Remember your password?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Sign in" })] })] }));
};
export default NewPasswordPage;

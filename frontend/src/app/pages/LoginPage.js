import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/auth';
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const setSession = useAuthStore((state) => state.setSession);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setSession({
                user: data.user,
                accessToken: data.tokens.access,
                refreshToken: data.tokens.refresh,
            });
            toast.success('Welcome back!');
            const redirect = location.state?.from?.pathname ?? '/';
            navigate(redirect, { replace: true });
        },
        onError: () => toast.error('Invalid credentials'),
    });
    const onSubmit = handleSubmit((values) => mutation.mutate(values));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Sign in" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Welcome back! Please enter your details." })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Email" }), _jsx("input", { type: "text", ...register('email'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50", placeholder: "user@gmail.com" }), errors.email && _jsx("p", { className: "text-xs text-red-400", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', ...register('password'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-[18px] text-slate-400 hover:text-white", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), errors.password && _jsx("p", { className: "text-xs text-red-400", children: errors.password.message })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: mutation.isPending, children: mutation.isPending ? 'Signing in…' : 'Sign in' })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-slate-200 dark:border-white/10" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-slate-50 px-2 text-slate-500 dark:bg-slate-950", children: "Or" }) })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "mb-3 text-sm text-slate-600 dark:text-slate-400", children: "External Users / Visitors" }), _jsx(Link, { to: "/visitor-access", className: "inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10", children: "Visitor Access" })] }), _jsxs("div", { className: "flex flex-col gap-2 text-center text-sm text-slate-600 dark:text-slate-400", children: [_jsxs("p", { children: ["No account?", ' ', _jsx(Link, { to: "/register", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Register (Students/Staff)" })] }), _jsx("p", { children: _jsx(Link, { to: "/forgot-password", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Forgot Password?" }) })] })] }));
};
export default LoginPage;

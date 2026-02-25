import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyResetCode, resendResetCode } from '../../lib/api/auth';
const schema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});
const ResetCodePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0)
            return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);
    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = handleSubmit(async (values) => {
        setIsLoading(true);
        try {
            await verifyResetCode(email, values.code);
            toast.success('Code verified successfully');
            navigate('/new-password', { state: { email, code: values.code } });
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || 'Invalid or expired code';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await resendResetCode(email);
            toast.success('New code sent to your email');
            setTimeLeft(120); // Reset timer
        }
        catch (error) {
            toast.error('Failed to resend code. Please try again.');
        }
        finally {
            setIsResending(false);
        }
    };
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Enter Verification Code" }), _jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["We sent a 6-digit code to ", _jsx("span", { className: "font-semibold", children: email })] })] }), _jsxs("div", { className: `flex items-center justify-center gap-2 rounded-lg p-3 ${timeLeft > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'}`, children: [_jsx("svg", { className: "h-5 w-5 text-amber-600 dark:text-amber-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { className: `text-sm font-medium ${timeLeft > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300'}`, children: timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired - request a new one' })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Verification Code" }), _jsx("input", { type: "text", ...register('code'), placeholder: "000000", maxLength: 6, disabled: isLoading, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-center text-2xl font-mono tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), errors.code && _jsx("p", { className: "text-xs text-red-400", children: errors.code.message })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: isLoading || timeLeft <= 0, children: isLoading ? 'Verifying...' : 'Verify Code' })] }), _jsxs("div", { className: "space-y-2 text-center text-sm", children: [_jsx("button", { type: "button", onClick: handleResendCode, disabled: isResending, className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 disabled:opacity-50", children: isResending ? 'Sending...' : 'Resend Code' }), _jsxs("p", { className: "text-slate-600 dark:text-slate-400", children: ["or", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Back to Login" })] })] })] }));
};
export default ResetCodePage;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { register as registerUser } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/auth';
const schema = z
    .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string().min(8, 'Password must be at least 8 characters'),
    registration_number: z.string().optional(),
    staff_id: z.string().optional(),
    account_type: z.enum(['STUDENT', 'STAFF']),
})
    .refine((values) => values.password === values.password_confirm, {
    message: 'Passwords must match',
    path: ['password_confirm'],
})
    .refine((values) => {
    if (values.account_type === 'STUDENT' && !values.registration_number)
        return false;
    if (values.account_type === 'STAFF' && !values.staff_id)
        return false;
    return true;
}, {
    message: 'ID Number is required',
    path: ['registration_number'], // Highlight this field generally
});
const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Default to STUDENT
    const [accountType, setAccountType] = useState('STUDENT');
    const navigate = useNavigate();
    const setSession = useAuthStore((state) => state.setSession);
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            account_type: 'STUDENT'
        }
    });
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Account created successfully! Please sign in.');
            navigate('/login');
        },
        onError: (error) => {
            const msg = error?.response?.data?.error || 'Registration failed';
            toast.error(msg);
        },
    });
    const onSubmit = handleSubmit((values) => {
        // Clear the unused ID field to be clean
        if (values.account_type === 'STUDENT')
            values.staff_id = '';
        if (values.account_type === 'STAFF')
            values.registration_number = '';
        mutation.mutate(values);
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Create account" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Join Bugema E-Library as Student or Staff." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-white/5", children: [_jsx("button", { type: "button", onClick: () => {
                            setAccountType('STUDENT');
                            setValue('account_type', 'STUDENT');
                        }, className: `rounded-lg px-4 py-2 text-sm font-medium transition-all ${accountType === 'STUDENT'
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`, children: "Student" }), _jsx("button", { type: "button", onClick: () => {
                            setAccountType('STAFF');
                            setValue('account_type', 'STAFF');
                        }, className: `rounded-lg px-4 py-2 text-sm font-medium transition-all ${accountType === 'STAFF'
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`, children: "Staff Member" })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Full name" }), _jsx("input", { ...register('name'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50", placeholder: "John Doe" }), errors.name && _jsx("p", { className: "text-xs text-red-400", children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400", children: accountType === 'STUDENT' ? 'Registration Number' : 'Staff ID Number' }), _jsx("input", { ...register(accountType === 'STUDENT' ? 'registration_number' : 'staff_id'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50", placeholder: accountType === 'STUDENT' ? '22/BSE/BU/R/0000' : 'STF/BU/000' }), (errors.registration_number || errors.staff_id) && (_jsx("p", { className: "text-xs text-red-400", children: errors.registration_number?.message || errors.staff_id?.message || "ID Number is required" }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Email" }), _jsx("input", { type: "email", ...register('email'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50", placeholder: "john@example.com" }), errors.email && _jsx("p", { className: "text-xs text-red-400", children: errors.email.message })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', ...register('password'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-[18px] text-slate-400 hover:text-white", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), errors.password && _jsx("p", { className: "text-xs text-red-400", children: errors.password.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Confirm password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showConfirmPassword ? 'text' : 'password', ...register('password_confirm'), disabled: mutation.isPending, className: "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-[18px] text-slate-400 hover:text-white", children: showConfirmPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), errors.password_confirm && (_jsx("p", { className: "text-xs text-red-400", children: errors.password_confirm.message }))] })] }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: mutation.isPending, children: mutation.isPending ? 'Creating…' : 'Create account' })] }), _jsxs("div", { className: "flex flex-col gap-2 text-center text-sm text-slate-600 dark:text-slate-400", children: [_jsxs("p", { children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Sign in" })] }), _jsxs("p", { children: ["Are you a Visitor?", ' ', _jsx(Link, { to: "/visitor-access", className: "font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200", children: "Go to Visitor Access" })] })] })] }));
};
export default RegisterPage;

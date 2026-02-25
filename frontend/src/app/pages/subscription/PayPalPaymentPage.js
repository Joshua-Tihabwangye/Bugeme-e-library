import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Wallet, Loader2, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSubscription, getPlans } from '../../../lib/api/subscriptions';
const PayPalPaymentPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('input');
    // Cache plans data
    const { data: plans } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: getPlans,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
    const plansArray = Array.isArray(plans) ? plans : [];
    const plan = plansArray.find(p => p.id === Number(planId));
    const mutation = useMutation({
        mutationFn: createSubscription,
        onSuccess: () => {
            setStep('success');
            setTimeout(() => navigate('/'), 3000);
        },
        onError: () => {
            toast.error('Payment failed. Please try again.');
            setStep('input');
        },
    });
    const handlePayPalRedirect = () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        setStep('processing');
        // Simulate PayPal redirect and processing
        setTimeout(() => {
            mutation.mutate({ plan_id: Number(planId), payment_method: 'PAYPAL' });
        }, 3000);
    };
    if (step === 'success') {
        return (_jsxs("div", { className: "mx-auto max-w-md py-16 text-center animate-in", children: [_jsx("div", { className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20", children: _jsx(Check, { className: "h-10 w-10 text-emerald-600 dark:text-emerald-400" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Payment Successful!" }), _jsxs("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: ["Your ", plan?.name, " subscription is now active. Redirecting..."] })] }));
    }
    return (_jsxs("div", { className: "mx-auto max-w-md space-y-6 py-8 animate-in", children: [_jsxs(Link, { to: `/subscription/payment/${planId}`, className: "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to payment options"] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500", children: _jsx(Wallet, { className: "h-8 w-8 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "PayPal Payment" }), _jsxs("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: ["Pay UGX ", plan ? Number(plan.price).toLocaleString() : '---', " for ", plan?.name] })] }), _jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "rounded-xl border border-slate-200 bg-white px-6 py-3 dark:border-white/10 dark:bg-slate-800", children: _jsxs("span", { className: "text-xl font-bold", children: [_jsx("span", { className: "text-sky-600", children: "Pay" }), _jsx("span", { className: "text-sky-800 dark:text-sky-400", children: "Pal" })] }) }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: "PayPal Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your-email@example.com", disabled: step === 'processing', className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" }), _jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: "You'll be redirected to PayPal to complete your payment" })] }), _jsx("button", { onClick: handlePayPalRedirect, disabled: step === 'processing' || !email, className: "w-full rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2", children: step === 'processing' ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Connecting to PayPal..."] })) : (_jsxs(_Fragment, { children: [_jsx(ExternalLink, { className: "h-4 w-4" }), "Pay with PayPal"] })) })] }), step === 'processing' && (_jsx("div", { className: "rounded-xl bg-sky-50 p-4 text-center dark:bg-sky-500/10", children: _jsx("p", { className: "text-sm text-sky-700 dark:text-sky-300", children: "Please complete the payment in the PayPal window. Do not close this page." }) })), _jsx("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/50", children: _jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 text-center", children: "PayPal protects your financial information with industry-leading security." }) })] }));
};
export default PayPalPaymentPage;

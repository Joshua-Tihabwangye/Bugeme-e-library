import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, Loader2, Check, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSubscription, getPlans } from '../../../lib/api/subscriptions';
const CardPaymentPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
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
            toast.error('Payment failed. Please check your card details.');
            setStep('input');
        },
    });
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };
    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (cardNumber.replace(/\s/g, '').length < 16) {
            toast.error('Please enter a valid card number');
            return;
        }
        if (expiry.length < 5) {
            toast.error('Please enter a valid expiry date');
            return;
        }
        if (cvv.length < 3) {
            toast.error('Please enter a valid CVV');
            return;
        }
        setStep('processing');
        setTimeout(() => {
            mutation.mutate({ plan_id: Number(planId), payment_method: 'VISA' });
        }, 2000);
    };
    if (step === 'success') {
        return (_jsxs("div", { className: "mx-auto max-w-md py-16 text-center animate-in", children: [_jsx("div", { className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20", children: _jsx(Check, { className: "h-10 w-10 text-emerald-600 dark:text-emerald-400" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Payment Successful!" }), _jsxs("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: ["Your ", plan?.name, " subscription is now active. Redirecting..."] })] }));
    }
    return (_jsxs("div", { className: "mx-auto max-w-md space-y-6 py-8 animate-in", children: [_jsxs(Link, { to: `/subscription/payment/${planId}`, className: "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to payment options"] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600", children: _jsx(CreditCard, { className: "h-8 w-8 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Card Payment" }), _jsxs("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: ["Pay UGX ", plan ? Number(plan.price).toLocaleString() : '---', " for ", plan?.name] })] }), _jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx("div", { className: "rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-800", children: _jsx("span", { className: "text-xs font-bold text-blue-600", children: "VISA" }) }), _jsx("div", { className: "rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-800", children: _jsx("span", { className: "text-xs font-bold text-orange-500", children: "MC" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: "Cardholder Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "John Doe", disabled: step === 'processing', className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: "Card Number" }), _jsx("input", { type: "text", value: cardNumber, onChange: (e) => setCardNumber(formatCardNumber(e.target.value)), placeholder: "4242 4242 4242 4242", maxLength: 19, disabled: step === 'processing', className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: "Expiry Date" }), _jsx("input", { type: "text", value: expiry, onChange: (e) => setExpiry(formatExpiry(e.target.value)), placeholder: "MM/YY", maxLength: 5, disabled: step === 'processing', className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: "CVV" }), _jsx("input", { type: "password", value: cvv, onChange: (e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)), placeholder: "\u2022\u2022\u2022", maxLength: 4, disabled: step === 'processing', className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white disabled:opacity-50" })] })] }), _jsx("button", { type: "submit", disabled: step === 'processing', className: "w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2", children: step === 'processing' ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Processing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Lock, { className: "h-4 w-4" }), "Pay UGX ", plan ? Number(plan.price).toLocaleString() : '---'] })) })] }), _jsxs("p", { className: "text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1", children: [_jsx(Lock, { className: "h-3 w-3" }), "Secured by SSL encryption"] })] }));
};
export default CardPaymentPage;

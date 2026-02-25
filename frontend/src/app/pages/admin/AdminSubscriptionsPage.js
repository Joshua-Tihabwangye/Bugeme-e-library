import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Filter } from 'lucide-react';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
import api from '../../../lib/api/client';
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
const AdminSubscriptionsPage = () => {
    const [period, setPeriod] = useState('all');
    // Fetch revenue stats
    const { data: revenue, isLoading: revenueLoading } = useQuery({
        queryKey: ['admin-subscription-revenue'],
        queryFn: async () => {
            const { data } = await api.get('/subscriptions/admin/revenue/');
            return data;
        },
        staleTime: 60 * 1000, // 1 minute cache
    });
    // Fetch subscription list with period filter
    const { data: subscriptions = [], isLoading: listLoading } = useQuery({
        queryKey: ['admin-subscription-list', period],
        queryFn: async () => {
            const params = period !== 'all' ? `?period=${period}` : '';
            const { data } = await api.get(`/subscriptions/admin/list/${params}`);
            // Handle both array and paginated response (with results array)
            if (Array.isArray(data)) {
                return data;
            }
            else if (data && Array.isArray(data.results)) {
                return data.results;
            }
            return [];
        },
        staleTime: 30 * 1000, // 30 seconds cache
    });
    const isLoading = revenueLoading || listLoading;
    if (isLoading) {
        return _jsx(LoadingOverlay, { label: "Loading subscriptions" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-brand-500 dark:text-brand-300", children: "Admin" }), _jsx("h1", { className: "mt-2 text-3xl font-bold text-slate-900 dark:text-white", children: "Subscription Management" }), _jsx("p", { className: "mt-1 text-slate-600 dark:text-slate-400", children: "Track revenue and manage subscriber accounts" })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx("div", { className: "stat-card-emerald", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400", children: "Today" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-900 dark:text-white", children: formatCurrency(revenue?.revenue_today || 0) })] }), _jsx("div", { className: "rounded-xl bg-emerald-500/10 p-3", children: _jsx(DollarSign, { className: "h-6 w-6 text-emerald-500" }) })] }) }), _jsx("div", { className: "stat-card-blue", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-blue-600 dark:text-blue-400", children: "This Month" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-900 dark:text-white", children: formatCurrency(revenue?.revenue_month || 0) })] }), _jsx("div", { className: "rounded-xl bg-blue-500/10 p-3", children: _jsx(Calendar, { className: "h-6 w-6 text-blue-500" }) })] }) }), _jsx("div", { className: "stat-card-violet", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-violet-600 dark:text-violet-400", children: "This Year" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-900 dark:text-white", children: formatCurrency(revenue?.revenue_year || 0) })] }), _jsx("div", { className: "rounded-xl bg-violet-500/10 p-3", children: _jsx(TrendingUp, { className: "h-6 w-6 text-violet-500" }) })] }) }), _jsx("div", { className: "stat-card-amber", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-amber-600 dark:text-amber-400", children: "Active Subscribers" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-900 dark:text-white", children: revenue?.active_subscribers || 0 })] }), _jsx("div", { className: "rounded-xl bg-amber-500/10 p-3", children: _jsx(Users, { className: "h-6 w-6 text-amber-500" }) })] }) })] }), _jsxs("div", { className: "card overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "All Subscriptions" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4 text-slate-500" }), _jsxs("select", { value: period, onChange: (e) => setPeriod(e.target.value), className: "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white", children: [_jsx("option", { value: "all", children: "All Time" }), _jsx("option", { value: "week", children: "This Week" }), _jsx("option", { value: "month", children: "This Month" }), _jsx("option", { value: "year", children: "This Year" })] })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm text-slate-600 dark:text-slate-400", children: [_jsx("thead", { className: "bg-slate-100 text-xs uppercase text-slate-600 dark:bg-slate-900/50 dark:text-slate-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Subscriber" }), _jsx("th", { className: "px-6 py-3", children: "Plan" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3", children: "Amount" }), _jsx("th", { className: "px-6 py-3", children: "Duration" }), _jsx("th", { className: "px-6 py-3", children: "Expires" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200 dark:divide-white/5", children: subscriptions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-8 text-center text-slate-500", children: "No subscriptions found" }) })) : (subscriptions.map((sub) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-white/5", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-slate-900 dark:text-white", children: sub.user_name }), _jsx("div", { className: "text-xs text-slate-500", children: sub.user_email })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "font-medium", children: sub.plan_name || 'N/A' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sub.is_active
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'}`, children: sub.is_active ? 'Active' : 'Expired' }) }), _jsx("td", { className: "px-6 py-4 font-medium", children: formatCurrency(parseFloat(sub.amount_paid)) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800", children: sub.plan_duration || 'N/A' }) }), _jsx("td", { className: "px-6 py-4", children: sub.end_date
                                                    ? new Date(sub.end_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : 'N/A' })] }, sub.id)))) })] }) })] })] }));
};
export default AdminSubscriptionsPage;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, } from 'recharts';
import { getUserAnalytics } from '../../../lib/api/reading';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
import StatCard from '../../../components/cards/StatCard';
const AnalyticsPagesPage = () => {
    const [period, setPeriod] = useState('week');
    const { data, isLoading } = useQuery({
        queryKey: ['analytics-pages', period],
        queryFn: () => getUserAnalytics(period),
        // staleTime: 5 * 60 * 1000, // Removed to ensure fresh data for now
    });
    if (isLoading)
        return _jsx(LoadingOverlay, { label: "Loading page analytics..." });
    // Transform data for charts
    // Assuming API returns 'pages_daily_activity' in the structure { date: string, pages: number }[]
    // If not yet available in API, we might need to mock or ensure backend is updated.
    // We updated backend to include `pages_daily_activity`.
    const dailyActivity = data?.pages_daily_activity || [];
    const totalPages = data?.total_pages_read || 0;
    // Calculate specific period stats from dailyActivity if needed, or rely on API totals
    const periodPages = dailyActivity.reduce((acc, curr) => acc + curr.pages, 0);
    const avgPages = dailyActivity.length > 0 ? Math.round(periodPages / dailyActivity.length) : 0;
    return (_jsxs("div", { className: "space-y-8 animate-in", children: [_jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back to Dashboard"] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Pages Analytics" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "Track your reading volume over time" })] }), _jsxs("select", { value: period, onChange: (e) => setPeriod(e.target.value), className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-white", children: [_jsx("option", { value: "week", children: "This Week" }), _jsx("option", { value: "month", children: "This Month" }), _jsx("option", { value: "year", children: "This Year" })] })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsx(StatCard, { label: "Total Pages Read", value: totalPages, icon: _jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }), variant: "emerald" }), _jsx(StatCard, { label: "Pages This Period", value: periodPages, icon: _jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }), variant: "blue" }), _jsx(StatCard, { label: "Avg Pages / Day", value: avgPages, icon: _jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }), variant: "violet" })] }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-2", children: [_jsxs("div", { className: "card h-96", children: [_jsx("h2", { className: "mb-6 text-lg font-semibold text-slate-900 dark:text-white", children: "Pages Read Per Day" }), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dailyActivity, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0", opacity: 0.5 }), _jsx(XAxis, { dataKey: "date", stroke: "#64748b", fontSize: 12, tickMargin: 10, tickFormatter: (val) => {
                                                const d = new Date(val);
                                                return `${d.getDate()}/${d.getMonth() + 1}`;
                                            } }), _jsx(YAxis, { stroke: "#64748b", fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }, labelStyle: { color: '#64748b' } }), _jsx(Bar, { dataKey: "pages", fill: "#10b981", radius: [4, 4, 0, 0], name: "Pages" })] }) })] }), _jsxs("div", { className: "card h-96", children: [_jsx("h2", { className: "mb-6 text-lg font-semibold text-slate-900 dark:text-white", children: "Reading Volume Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: dailyActivity, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorPages", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8b5cf6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#8b5cf6", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0", opacity: 0.5 }), _jsx(XAxis, { dataKey: "date", stroke: "#64748b", fontSize: 12, tickFormatter: (val) => {
                                                const d = new Date(val);
                                                return `${d.getDate()}/${d.getMonth() + 1}`;
                                            } }), _jsx(YAxis, { stroke: "#64748b", fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            } }), _jsx(Area, { type: "monotone", dataKey: "pages", stroke: "#8b5cf6", fillOpacity: 1, fill: "url(#colorPages)", name: "Pages" })] }) })] })] })] }));
};
export default AnalyticsPagesPage;

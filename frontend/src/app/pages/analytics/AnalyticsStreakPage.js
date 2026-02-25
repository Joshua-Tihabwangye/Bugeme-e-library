import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../../../lib/api/reading';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
const AnalyticsStreakPage = () => {
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => getDashboard(),
        staleTime: 2 * 60 * 1000,
    });
    // Generate calendar data for selected month
    const calendarData = useMemo(() => {
        if (!dashboardData?.stats?.streak_history)
            return [];
        const streakHistory = dashboardData.stats.streak_history || [];
        const readDates = new Set(streakHistory.filter((d) => d.read).map((d) => d.date));
        const firstDay = new Date(selectedYear, selectedMonth, 1);
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        const days = [];
        // Add empty slots for days before the 1st
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ date: null, read: false });
        }
        // Add actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            days.push({
                date: dateStr,
                day: d,
                read: readDates.has(dateStr)
            });
        }
        return days;
    }, [dashboardData, selectedMonth, selectedYear]);
    if (isLoading) {
        return _jsx(LoadingOverlay, { label: "Loading streak data" });
    }
    const currentStreak = dashboardData?.stats?.current_streak_days || 0;
    const longestStreak = dashboardData?.stats?.longest_streak_days || 0;
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Generate year options (2025-2030)
    const yearOptions = [2025, 2026, 2027, 2028, 2029, 2030];
    return (_jsxs("div", { className: "space-y-8 animate-in", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", children: _jsx("svg", { className: "h-6 w-6 text-slate-600 dark:text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.4em] text-brand-600 dark:text-brand-400", children: "Analytics" }), _jsx("h1", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: "Reading Streak" })] })] }), _jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [_jsx("div", { className: "card p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "rounded-full bg-white/20 p-3", children: _jsx("svg", { className: "h-8 w-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-amber-100", children: "Current Streak" }), _jsxs("h2", { className: "text-3xl font-bold", children: [currentStreak, " Days"] })] })] }) }), _jsx("div", { className: "card p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "rounded-full bg-slate-100 p-3 dark:bg-slate-800", children: _jsx("svg", { className: "h-8 w-8 text-slate-600 dark:text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-500 dark:text-slate-400", children: "Longest Streak" }), _jsxs("h2", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: [longestStreak, " Days"] })] })] }) })] }), _jsxs("div", { className: "card p-6", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Reading Calendar" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(parseInt(e.target.value)), className: "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-white", children: months.map((month, idx) => (_jsx("option", { value: idx, children: month }, month))) }), _jsx("select", { value: selectedYear, onChange: (e) => setSelectedYear(parseInt(e.target.value)), className: "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-white", children: yearOptions.map(year => (_jsx("option", { value: year, children: year }, year))) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: weekDays.map(day => (_jsx("div", { className: "text-center text-xs font-medium text-slate-400 dark:text-slate-500", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: calendarData.map((item, index) => (_jsx("div", { className: `h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all
                                ${!item.date
                                ? ''
                                : item.read
                                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`, children: item.day || '' }, index))) }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 rounded-full bg-amber-500" }), _jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Reading day" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800" }), _jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "No reading" })] })] })] }), _jsx("div", { className: "card p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-amber-900 dark:text-amber-100", children: "Keep Your Streak Going!" }), _jsx("p", { className: "text-sm text-amber-800 dark:text-amber-200 mt-1", children: "Read at least one page every day to maintain your streak. Even a few minutes of reading counts!" })] })] }) })] }));
};
export default AnalyticsStreakPage;

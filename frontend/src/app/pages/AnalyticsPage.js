import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getDashboard } from '../../lib/api/reading';
import LoadingOverlay from '../../components/feedback/LoadingOverlay';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const AnalyticsPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => getDashboard(),
        staleTime: 2 * 60 * 1000,
    });
    if (isLoading) {
        return _jsx(LoadingOverlay, { label: "Loading analytics" });
    }
    if (!data) {
        return (_jsx("div", { className: "flex min-h-[40vh] items-center justify-center text-center", children: _jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "Unable to load analytics data." }) }));
    }
    // Prepare data for charts
    const dailyActivity = data.stats.daily_activity || [];
    const completionData = [
        { name: 'Completed', value: data.completed?.length || 0 },
        { name: 'In Progress', value: data.in_progress?.length || 0 },
    ];
    return (_jsxs("div", { className: "space-y-8 animate-in", children: [_jsxs("div", { className: "page-header", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.4em] text-brand-600 dark:text-brand-400", children: "Analytics" }), _jsx("h1", { className: "page-title", children: "Reading Habits" }), _jsx("p", { className: "page-subtitle", children: "Visualize your reading performance over time" })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "card p-6", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-4", children: "Daily Reading Time (Last 14 Days)" }), _jsx("div", { className: "h-[300px] w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dailyActivity, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.1 }), _jsx(XAxis, { dataKey: "date", tickFormatter: (value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), fontSize: 12, tick: { fill: '#64748b' } }), _jsx(YAxis, { label: { value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }, fontSize: 12, tick: { fill: '#64748b' } }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }, itemStyle: { color: '#fff' }, formatter: (value) => [`${value} mins`, 'Reading Time'], labelFormatter: (label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }), _jsx(Bar, { dataKey: "minutes", fill: "#8b5cf6", radius: [4, 4, 0, 0] })] }) }) })] }), _jsxs("div", { className: "card p-6", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-4", children: "Reading Trend" }), _jsx("div", { className: "h-[300px] w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: dailyActivity, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.1 }), _jsx(XAxis, { dataKey: "date", tickFormatter: (value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), fontSize: 12, tick: { fill: '#64748b' } }), _jsx(YAxis, { fontSize: 12, tick: { fill: '#64748b' } }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }, itemStyle: { color: '#fff' } }), _jsx(Line, { type: "monotone", dataKey: "minutes", stroke: "#10b981", strokeWidth: 3, dot: { r: 4 }, activeDot: { r: 6 } })] }) }) })] }), _jsxs("div", { className: "card p-6", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-4", children: "Book Completion Status" }), _jsx("div", { className: "h-[300px] w-full flex items-center justify-center", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: completionData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 100, fill: "#8884d8", paddingAngle: 5, dataKey: "value", children: completionData.map((entry, index) => (_jsx(Cell, { fill: index === 0 ? '#8b5cf6' : '#3b82f6' }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }, itemStyle: { color: '#fff' } })] }) }) }), _jsxs("div", { className: "flex justify-center gap-6 mt-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-violet-500" }), _jsxs("span", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["Completed (", completionData[0].value, ")"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-blue-500" }), _jsxs("span", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["In Progress (", completionData[1].value, ")"] })] })] })] })] })] }));
};
export default AnalyticsPage;

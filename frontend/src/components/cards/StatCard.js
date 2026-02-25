import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StatCard = ({ label, value, icon, hint, trend, variant = 'default' }) => {
    const variantClasses = {
        blue: 'stat-card-blue',
        emerald: 'stat-card-emerald',
        violet: 'stat-card-violet',
        amber: 'stat-card-amber',
        rose: 'stat-card-rose',
        cyan: 'stat-card-cyan',
        default: 'card',
    };
    const iconColors = {
        blue: 'text-blue-600 dark:text-blue-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        violet: 'text-violet-600 dark:text-violet-400',
        amber: 'text-amber-600 dark:text-amber-400',
        rose: 'text-rose-600 dark:text-rose-400',
        cyan: 'text-cyan-600 dark:text-cyan-400',
        default: 'text-brand-600 dark:text-brand-400',
    };
    return (_jsx("div", { className: variantClasses[variant], children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300", children: label }), _jsxs("div", { className: "mt-3 flex items-baseline gap-2", children: [_jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: value }), trend && (_jsxs("span", { className: `inline-flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`, children: [trend.isPositive ? (_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) })) : (_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })), Math.abs(trend.value), "%"] }))] }), hint && _jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: hint })] }), icon && (_jsx("div", { className: `rounded-xl bg-white/50 p-3 dark:bg-slate-800/50 ${iconColors[variant]}`, children: icon }))] }) }));
};
export default StatCard;

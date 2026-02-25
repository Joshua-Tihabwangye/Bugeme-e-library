import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
const SimpleAuthLayout = () => (_jsx("div", { className: "flex min-h-screen bg-white text-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white", children: _jsxs("div", { className: "mx-auto flex w-full max-w-6xl flex-col", children: [_jsx("div", { className: "flex justify-end px-6 pt-6", children: _jsx(ThemeToggle, {}) }), _jsx("div", { className: "flex flex-1 items-center justify-center px-6 py-10", children: _jsxs("div", { className: "w-full max-w-md space-y-10", children: [_jsx(Link, { to: "/", className: "text-sm font-semibold text-slate-900 dark:text-white", children: "\u2190 Back to Home" }), _jsx(Outlet, {})] }) })] }) }));
export default SimpleAuthLayout;

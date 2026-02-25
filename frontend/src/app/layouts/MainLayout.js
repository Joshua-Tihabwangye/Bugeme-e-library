import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/auth';
import ThemeToggle from '../../components/ThemeToggle';
import ProfileDropdown from '../../components/ProfileDropdown';
import HamburgerMenu from '../../components/HamburgerMenu';
import bugemaLogo from '../../../bugema.webp';
const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Catalog', to: '/catalog' },
    { label: 'Libris AI', to: '/libris-ai' },
    { label: 'Dashboard', to: '/dashboard', protected: true },
];
const MainLayout = () => {
    const user = useAuthStore((state) => state.user);
    return (_jsxs("div", { className: "min-h-screen bg-white dark:bg-slate-950", children: [_jsx("header", { className: "relative z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/5 dark:bg-slate-950/80", children: _jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white", children: [_jsx("img", { src: bugemaLogo, alt: "Bugema University logo", className: "h-8 w-8 rounded-full object-cover" }), _jsx("span", { className: "hidden md:inline", children: "Bugema University E-Library" })] }), _jsxs("nav", { className: "hidden gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex", children: [navItems.map((item) => {
                                    if (item.protected && !user)
                                        return null;
                                    return (_jsx(NavLink, { to: item.to, className: ({ isActive }) => `transition hover:text-slate-900 dark:hover:text-white ${isActive ? 'text-slate-900 dark:text-white' : ''}`, children: item.label }, item.to));
                                }), user?.role === 'ADMIN' && (_jsx(NavLink, { to: "/admin", className: ({ isActive }) => (isActive ? 'text-slate-900 dark:text-white' : ''), children: "Admin" }))] }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx(ThemeToggle, {}), user ? (_jsxs(_Fragment, { children: [_jsx(HamburgerMenu, {}), _jsx(ProfileDropdown, {})] })) : (_jsxs("div", { className: "space-x-3", children: [_jsx(Link, { to: "/login", className: "text-sm font-medium text-slate-900 hover:text-slate-900 dark:text-white dark:hover:text-white", children: "Login" }), _jsx(Link, { to: "/register", className: "hidden btn-primary text-sm md:inline-flex", children: "Register" })] }))] })] }) }), _jsx("main", { className: "mx-auto max-w-6xl px-4 py-10", children: _jsx(Outlet, {}) }), _jsxs("footer", { className: "border-t border-slate-200 bg-white/80 py-6 text-center text-xs text-slate-500 dark:border-white/5 dark:bg-slate-950/80", children: ["\u00A9 ", new Date().getFullYear(), " Bugema University E-Library \u2013 Excellence in Service"] })] }));
};
export default MainLayout;

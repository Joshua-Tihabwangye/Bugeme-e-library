import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store/auth';
import { logout } from '../lib/api/auth';
const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, clearSession, refreshToken } = useAuthStore();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = async () => {
        try {
            await logout(refreshToken);
        }
        finally {
            clearSession();
        }
    };
    if (!user)
        return null;
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-white/5", children: [user.profile_picture ? (_jsx("img", { src: user.profile_picture, alt: user.name, className: "h-10 w-10 rounded-full object-cover" })) : (_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white", children: user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() })), _jsxs("div", { className: "hidden text-left md:block", children: [_jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white", children: user.name }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: user.email })] }), _jsx("svg", { className: `h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isOpen && (_jsxs("div", { className: "absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900", children: [_jsxs("div", { className: "p-3 border-b border-slate-200 dark:border-white/10", children: [_jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white", children: user.name }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: user.email }), _jsx("p", { className: "mt-1 text-xs text-slate-400 dark:text-slate-500 capitalize", children: user.role.toLowerCase() })] }), _jsxs("div", { className: "p-2", children: [_jsxs(Link, { to: "/profile", onClick: () => setIsOpen(false), className: "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "My Profile"] }), _jsxs("button", { onClick: handleLogout, className: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), "Log Out"] })] })] }))] }));
};
export default ProfileDropdown;

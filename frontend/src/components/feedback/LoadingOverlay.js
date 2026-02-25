import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingOverlay = ({ label = 'Loading...' }) => (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs("div", { className: "space-y-3 text-center", children: [_jsx("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" }), _jsx("p", { className: "text-sm text-slate-400", children: label })] }) }));
export default LoadingOverlay;

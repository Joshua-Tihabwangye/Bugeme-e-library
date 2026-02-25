import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false, }) => {
    if (!isOpen)
        return null;
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-slate-800 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full mx-4 overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-white/10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: title }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }) }), _jsx("div", { className: "px-6 py-6", children: _jsx("p", { className: "text-slate-300 leading-relaxed", children: message }) }), _jsxs("div", { className: "px-6 py-4 bg-slate-900/50 flex gap-3 justify-end", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all", children: cancelText }), _jsx("button", { onClick: handleConfirm, className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'}`, children: confirmText })] })] })] }));
};
export default ConfirmDialog;

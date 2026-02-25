import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
const RenewalNotification = ({ expiryDate, onDismiss }) => {
    const [dismissed, setDismissed] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const diff = expiryDate.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 24) {
                const days = Math.floor(hours / 24);
                setTimeLeft(`${days} day${days > 1 ? 's' : ''}`);
            }
            else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
            else {
                setTimeLeft(`${minutes} minutes`);
            }
        };
        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [expiryDate]);
    if (dismissed)
        return null;
    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };
    const formattedDate = expiryDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return (_jsxs("div", { className: "fixed bottom-4 right-4 z-50 max-w-sm animate-in rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-xl dark:border-amber-500/30 dark:from-amber-900/30 dark:to-orange-900/20", children: [_jsx("button", { onClick: handleDismiss, className: "absolute right-2 top-2 rounded-full p-1 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-800/30", children: _jsx(X, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20", children: _jsx(AlertTriangle, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-amber-800 dark:text-amber-300", children: "Subscription Expiring Soon" }), _jsxs("p", { className: "mt-1 text-sm text-amber-700 dark:text-amber-400", children: [_jsx(Clock, { className: "mr-1 inline h-3 w-3" }), _jsx("span", { className: "font-medium", children: timeLeft }), " remaining"] }), _jsxs("p", { className: "text-xs text-amber-600 dark:text-amber-500", children: ["Expires: ", formattedDate] }), _jsx(Link, { to: "/subscription/plans", className: "mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition", children: "Renew Now" })] })] })] }));
};
export default RenewalNotification;

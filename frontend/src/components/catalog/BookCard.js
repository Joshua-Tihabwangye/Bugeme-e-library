import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/store/auth";
import { useSubscription } from "../../lib/hooks/useSubscription";
import SubscriptionPaywall from "../subscription/SubscriptionPaywall";
const BookCard = memo(({ book, viewMode, onLike, onBookmark }) => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const { needsSubscription, isLoading: subscriptionLoading } = useSubscription();
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallAction, setPaywallAction] = useState("");
    const handleProtectedAction = (action) => {
        if (!subscriptionLoading && needsSubscription) {
            setPaywallAction(action === "view" ? "view book details" : "read books");
            setShowPaywall(true);
            return true; // Action was blocked
        }
        return false; // Action allowed
    };
    const handleViewClick = (e) => {
        if (handleProtectedAction("view")) {
            e.preventDefault();
            return;
        }
        // Navigation will proceed normally via Link
    };
    const handleReadClick = (e) => {
        e.preventDefault();
        if (!handleProtectedAction("read")) {
            navigate(`/reader/${book.id}`);
        }
    };
    return (_jsxs(_Fragment, { children: [viewMode === "grid" ? (_jsxs("div", { className: "card flex flex-col gap-3 p-4", children: [_jsx("div", { className: "aspect-square w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800", children: book.cover_image ? (_jsx("img", { src: book.cover_image, alt: book.title, className: "h-full w-full object-cover transition duration-300 hover:scale-105", loading: "lazy" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-600", children: "No Cover" })) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-brand-600 dark:text-brand-300", children: book.author }), _jsx("h3", { className: "mt-1 text-base font-semibold text-slate-900 dark:text-white line-clamp-2", children: book.title }), _jsx("p", { className: "mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400", children: book.description })] }), _jsxs("div", { className: "flex items-center gap-2 text-[10px]", children: [_jsx("span", { className: "rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300", children: book.language }), _jsx("span", { className: "rounded bg-rose-100 px-1.5 py-0.5 font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300", children: book.file_type }), book.reading_progress && (_jsxs("span", { className: "ml-auto text-brand-600 dark:text-brand-200", children: [Math.round(book.reading_progress.percent), "%"] }))] }), _jsx("div", { className: "flex flex-wrap gap-1.5 text-[10px]", children: Array.isArray(book.tags)
                            ? book.tags.slice(0, 3).map((tag) => (_jsxs("span", { className: `rounded-full px-2 py-0.5 font-medium ${tag.toLowerCase() === "new"
                                    ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`, children: ["#", tag] }, tag)))
                            : null }), _jsxs("div", { className: "mt-auto flex flex-col gap-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: `/catalog/${book.id}`, onClick: handleViewClick, className: "flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:border-brand-500 dark:hover:bg-white/5", children: "View" }), _jsx("button", { onClick: handleReadClick, className: "btn-gradient-blue flex-1 px-3 py-1.5 text-center text-xs font-semibold rounded-lg", children: "Read" })] }), user && (_jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx("button", { onClick: () => onLike(book.id), className: `btn-icon ${book.is_liked
                                            ? "text-red-500"
                                            : "text-slate-400 hover:text-red-500"}`, title: book.is_liked ? "Unlike" : "Like", children: _jsx("svg", { className: "h-6 w-6", fill: book.is_liked
                                                ? "currentColor"
                                                : "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }) }), _jsx("button", { onClick: () => onBookmark(book.id), className: `btn-icon ${book.is_bookmarked
                                            ? "text-blue-500"
                                            : "text-slate-400 hover:text-blue-500"}`, title: book.is_bookmarked
                                            ? "Remove bookmark"
                                            : "Bookmark", children: _jsx("svg", { className: "h-6 w-6", fill: book.is_bookmarked
                                                ? "currentColor"
                                                : "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) })] }))] })] })) : (_jsxs("div", { className: "card flex gap-4 p-4", children: [_jsx("div", { className: "h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800", children: book.cover_image ? (_jsx("img", { src: book.cover_image, alt: book.title, className: "h-full w-full object-cover", loading: "lazy" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-600", children: "No Cover" })) }), _jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-brand-600 dark:text-brand-300", children: book.author }), _jsx("h3", { className: "mt-1 text-lg font-semibold text-slate-900 dark:text-white", children: book.title }), _jsx("p", { className: "mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400", children: book.description })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx("span", { className: "rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300", children: book.language }), _jsx("span", { className: "rounded bg-rose-100 px-2 py-0.5 font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300", children: book.file_type }), book.reading_progress && (_jsxs("span", { className: "ml-auto text-brand-600 dark:text-brand-200", children: [Math.round(book.reading_progress.percent), "%"] }))] }), _jsx("div", { className: "flex flex-wrap gap-1.5 text-xs", children: Array.isArray(book.tags)
                                    ? book.tags.slice(0, 5).map((tag) => (_jsxs("span", { className: `rounded-full px-2.5 py-0.5 font-medium ${tag.toLowerCase() === "new"
                                            ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`, children: ["#", tag] }, tag)))
                                    : null }), _jsxs("div", { className: "mt-auto flex items-center gap-3", children: [_jsx(Link, { to: `/catalog/${book.id}`, onClick: handleViewClick, className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5", children: "View Details" }), _jsx("button", { onClick: handleReadClick, className: "btn-gradient-blue px-4 py-2 text-sm opacity-100 visible", style: {
                                            opacity: 1,
                                            visibility: "visible",
                                        }, children: "Read Now" }), user && (_jsxs("div", { className: "ml-auto flex items-center gap-3", children: [_jsx("button", { onClick: () => onLike(book.id), className: `btn-icon ${book.is_liked
                                                    ? "text-red-500"
                                                    : "text-slate-400 hover:text-red-500"}`, title: book.is_liked
                                                    ? "Unlike"
                                                    : "Like", children: _jsx("svg", { className: "h-6 w-6", fill: book.is_liked
                                                        ? "currentColor"
                                                        : "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }) }), _jsx("button", { onClick: () => onBookmark(book.id), className: `btn-icon ${book.is_bookmarked
                                                    ? "text-blue-500"
                                                    : "text-slate-400 hover:text-blue-500"}`, title: book.is_bookmarked
                                                    ? "Remove bookmark"
                                                    : "Bookmark", children: _jsx("svg", { className: "h-6 w-6", fill: book.is_bookmarked
                                                        ? "currentColor"
                                                        : "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) })] }))] })] })] })), _jsx(SubscriptionPaywall, { isOpen: showPaywall, onClose: () => setShowPaywall(false), actionBlocked: paywallAction })] }));
});
BookCard.displayName = "BookCard";
export default BookCard;

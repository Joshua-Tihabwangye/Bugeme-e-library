import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getBookDetail, toggleBookmark, toggleLike } from '../../lib/api/catalog';
import LoadingOverlay from '../../components/feedback/LoadingOverlay';
import SubscriptionPaywall from '../../components/subscription/SubscriptionPaywall';
import { useAuthStore } from '../../lib/store/auth';
import { useSubscription } from '../../lib/hooks/useSubscription';
const BookDetailPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallAction, setPaywallAction] = useState('');
    // Check if visitor needs subscription
    const { needsSubscription, isLoading: subscriptionLoading } = useSubscription();
    const { data: book, isLoading } = useQuery({
        queryKey: ['book', bookId],
        queryFn: () => getBookDetail(bookId),
        enabled: Boolean(bookId),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
    const likeMutation = useMutation({
        mutationFn: () => toggleLike(Number(bookId)),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['book', bookId] });
            const previousBook = queryClient.getQueryData(['book', bookId]);
            queryClient.setQueryData(['book', bookId], (old) => {
                if (!old)
                    return old;
                return {
                    ...old,
                    is_liked: !old.is_liked,
                    like_count: old.is_liked ? old.like_count - 1 : old.like_count + 1
                };
            });
            return { previousBook };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(['book', bookId], context.previousBook);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['book', bookId] }),
    });
    const bookmarkMutation = useMutation({
        mutationFn: () => toggleBookmark(Number(bookId)),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['book', bookId] });
            const previousBook = queryClient.getQueryData(['book', bookId]);
            queryClient.setQueryData(['book', bookId], (old) => {
                if (!old)
                    return old;
                return {
                    ...old,
                    is_bookmarked: !old.is_bookmarked,
                    bookmark_count: old.is_bookmarked ? old.bookmark_count - 1 : old.bookmark_count + 1
                };
            });
            return { previousBook };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(['book', bookId], context.previousBook);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['book', bookId] }),
    });
    // Handler that checks subscription before allowing action
    const handleProtectedAction = (action) => {
        if (!subscriptionLoading && needsSubscription) {
            setPaywallAction(action === 'like' ? 'like books' : action === 'bookmark' ? 'bookmark books' : 'read books');
            setShowPaywall(true);
            return true; // Action was blocked
        }
        return false; // Action allowed
    };
    const handleLike = () => {
        if (!handleProtectedAction('like')) {
            likeMutation.mutate();
        }
    };
    const handleBookmark = () => {
        if (!handleProtectedAction('bookmark')) {
            bookmarkMutation.mutate();
        }
    };
    const handleOpenReader = () => {
        if (!handleProtectedAction('read')) {
            navigate(`/reader/${book?.id}`);
        }
    };
    if (isLoading || !book) {
        return _jsx(LoadingOverlay, { label: "Loading book details" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("button", { onClick: () => navigate(-1), className: "text-sm text-slate-600 dark:text-slate-400", children: "\u2190 Back to list" }), _jsxs("div", { className: "card grid gap-8 lg:grid-cols-3", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.4em] text-brand-600 dark:text-brand-300", children: book.author }), _jsx("h1", { className: "mt-2 text-4xl font-semibold text-slate-900 dark:text-white", children: book.title }), _jsx("p", { className: "mt-4 text-slate-700 dark:text-slate-300", children: book.description }), _jsxs("div", { className: "mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2", children: [_jsxs("p", { children: ["Language: ", book.language] }), _jsxs("p", { children: ["Year: ", book.year ?? '—'] }), _jsxs("p", { children: ["Pages: ", book.pages ?? '—'] }), _jsxs("p", { children: ["ISBN: ", book.isbn] })] }), _jsx("div", { className: "mt-6 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-500", children: Array.isArray(book.tags) && book.tags.map((tag) => (_jsxs("span", { className: "rounded-full border border-slate-200 px-3 py-1 dark:border-white/10", children: ["#", tag] }, tag))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-300", children: [_jsx("p", { className: "text-xs font-semibold uppercase text-slate-500 dark:text-slate-400", children: "Stats" }), _jsxs("p", { className: "mt-3", children: ["Views \u2022 ", book.view_count] }), _jsxs("p", { children: ["Likes \u2022 ", book.like_count] }), _jsxs("p", { children: ["Bookmarks \u2022 ", book.bookmark_count] }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsx("div", { className: "text-lg leading-none text-yellow-400", children: "\u2605\u2605\u2605\u2605\u2606" }), _jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "4.0 rating" })] })] }), user ? (_jsxs("div", { className: "space-y-2", children: [_jsx("button", { className: "btn-primary w-full", onClick: handleOpenReader, children: "Open reader" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: `w-1/2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${book.is_liked
                                                    ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                                    : 'border-slate-300 text-slate-700 hover:border-red-500/50 hover:bg-red-50 dark:border-white/10 dark:text-white dark:hover:bg-red-500/5'}`, onClick: handleLike, children: "\u2665 Like" }), _jsx("button", { className: `w-1/2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${book.is_bookmarked
                                                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300'
                                                    : 'border-slate-300 text-slate-700 hover:border-brand-400/50 hover:bg-brand-50 dark:border-white/10 dark:text-white dark:hover:bg-brand-400/5'}`, onClick: handleBookmark, children: "\u2301 Bookmark" })] })] })) : (_jsx("p", { className: "text-xs text-slate-400", children: "Log in to like, bookmark, and open the reader." }))] })] }), _jsx(SubscriptionPaywall, { isOpen: showPaywall, onClose: () => setShowPaywall(false), actionBlocked: paywallAction })] }));
};
export default BookDetailPage;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from 'react';
import { BookOpen, Clock3, Search, SendHorizontal, Sparkles } from 'lucide-react';
const quickActions = ['Summarize this chapter', 'Find related resources', 'Create revision questions'];
const LibrisAIPage = () => {
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: 'Welcome. Ask anything about your library resources and study content.',
            timestamp: '09:40',
        },
    ]);
    const inputRef = useRef(null);
    const recentUserPrompts = useMemo(() => messages
        .filter((message) => message.role === 'user')
        .map((message) => message.text)
        .slice(-4)
        .reverse(), [messages]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const prompt = draft.trim();
        if (!prompt)
            return;
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => {
            const nextId = prev[prev.length - 1]?.id ?? 0;
            return [
                ...prev,
                {
                    id: nextId + 1,
                    role: 'user',
                    text: prompt,
                    timestamp,
                },
                {
                    id: nextId + 2,
                    role: 'assistant',
                    text: 'Noted. Share more context or a file and I will give you a focused answer.',
                    timestamp,
                },
            ];
        });
        setDraft('');
        inputRef.current?.focus();
    };
    const applyQuickAction = (prompt) => {
        setDraft(prompt);
        inputRef.current?.focus();
    };
    return (_jsxs("div", { className: "mx-auto w-full max-w-4xl space-y-8", children: [_jsxs("section", { className: "space-y-3 text-center", children: [_jsxs("p", { className: "inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:bg-brand-500/15 dark:text-brand-300", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Libris AI"] }), _jsx("h1", { className: "text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl", children: "Start Simple" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 md:text-base", children: "Ask a clear question, get a focused answer, and move quickly." })] }), _jsx("section", { className: "flex flex-wrap items-center justify-center gap-2", children: quickActions.map((action) => (_jsx("button", { type: "button", onClick: () => applyQuickAction(action), className: "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/15 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300", children: action }, action))) }), _jsx("form", { onSubmit: handleSubmit, className: "space-y-3", children: _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-900", children: [_jsx("input", { ref: inputRef, value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "Message Libris...", className: "h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500" }), _jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400", children: [_jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800", children: [_jsx(BookOpen, { className: "h-3.5 w-3.5" }), "Library"] }), _jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800", children: [_jsx(Search, { className: "h-3.5 w-3.5" }), "Search"] })] }), _jsxs("button", { type: "submit", className: "inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700", children: ["Send", _jsx(SendHorizontal, { className: "h-4 w-4" })] })] })] }) }), _jsxs("section", { className: "space-y-3", children: [_jsx("h2", { className: "text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400", children: "Recent Activity" }), recentUserPrompts.length === 0 ? (_jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No recent prompts yet." })) : (_jsx("div", { className: "space-y-2", children: recentUserPrompts.map((prompt) => (_jsxs("button", { type: "button", onClick: () => applyQuickAction(prompt), className: "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300", children: [_jsx("span", { className: "truncate", children: prompt }), _jsx(Clock3, { className: "ml-3 h-4 w-4 shrink-0 text-slate-400" })] }, prompt))) }))] })] }));
};
export default LibrisAIPage;

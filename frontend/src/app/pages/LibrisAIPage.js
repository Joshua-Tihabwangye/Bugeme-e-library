import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Bot, Clock3, Database, FileText, MessageSquareText, Mic, SendHorizontal, Sparkles, UserRound, } from 'lucide-react';
const quickPrompts = [
    'Summarize chapter 4 in 5 bullet points',
    'Create revision questions from today reading',
    'Explain this text in simpler language',
    'Find related references in the library',
];
const sourceCards = [
    {
        title: 'Advanced Data Structures',
        chapter: 'Chapter 7: Graph Algorithms',
        confidence: '98% match',
    },
    {
        title: 'Digital Research Methods',
        chapter: 'Section 3.2: Citation Standards',
        confidence: '94% match',
    },
    {
        title: 'Academic Writing Handbook',
        chapter: 'Unit 5: Critical Summary',
        confidence: '91% match',
    },
];
const LibrisAIPage = () => {
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: 'Welcome to Libris AI. Ask anything about your books, research, citations, or summaries and I will guide you.',
            timestamp: '09:40',
        },
        {
            id: 2,
            role: 'user',
            text: 'Help me prepare notes from the machine learning chapter for tomorrow.',
            timestamp: '09:41',
        },
        {
            id: 3,
            role: 'assistant',
            text: 'I can do that. Send the chapter title or paste your selected section and I will return structured notes, key terms, and review questions.',
            timestamp: '09:41',
        },
    ]);
    const composerRef = useRef(null);
    const transcriptRef = useRef(null);
    useEffect(() => {
        const panel = transcriptRef.current;
        if (panel) {
            panel.scrollTop = panel.scrollHeight;
        }
    }, [messages]);
    const messageCount = useMemo(() => ({
        assistant: messages.filter((m) => m.role === 'assistant').length,
        user: messages.filter((m) => m.role === 'user').length,
        total: messages.length,
    }), [messages]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const prompt = draft.trim();
        if (!prompt)
            return;
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const nextId = messages[messages.length - 1]?.id ?? 0;
        const userMessage = {
            id: nextId + 1,
            role: 'user',
            text: prompt,
            timestamp: time,
        };
        const assistantMessage = {
            id: nextId + 2,
            role: 'assistant',
            text: 'UI is ready. Connect your API in this submit handler and replace this placeholder response with your real Libris AI output.',
            timestamp: time,
        };
        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setDraft('');
        composerRef.current?.focus();
    };
    const applyPrompt = (prompt) => {
        setDraft(prompt);
        composerRef.current?.focus();
    };
    return (_jsxs("div", { className: "space-y-8 animate-in", children: [_jsxs("section", { className: "relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-8 text-white shadow-2xl shadow-slate-900/30 dark:border-white/10", children: [_jsx("div", { className: "absolute -right-10 top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" }), _jsx("div", { className: "absolute -bottom-12 left-12 h-32 w-32 rounded-full bg-brand-500/30 blur-3xl" }), _jsxs("div", { className: "relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-2xl space-y-4", children: [_jsxs("p", { className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em]", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Libris AI Workspace"] }), _jsx("h1", { className: "text-4xl font-bold leading-tight md:text-5xl", children: "Professional conversational UI for your library intelligence system" }), _jsx("p", { className: "text-sm leading-relaxed text-slate-200 md:text-base", children: "Designed for summaries, citations, and contextual guidance with a clear integration path to your own AI backend." })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 text-xs sm:text-sm", children: [_jsxs("div", { className: "rounded-2xl border border-white/20 bg-white/10 p-3 text-center", children: [_jsx("p", { className: "font-semibold text-white", children: messageCount.total }), _jsx("p", { className: "text-slate-300", children: "Messages" })] }), _jsxs("div", { className: "rounded-2xl border border-white/20 bg-white/10 p-3 text-center", children: [_jsx("p", { className: "font-semibold text-white", children: sourceCards.length }), _jsx("p", { className: "text-slate-300", children: "Sources" })] }), _jsxs("div", { className: "rounded-2xl border border-white/20 bg-white/10 p-3 text-center", children: [_jsx("p", { className: "font-semibold text-white", children: "Live" }), _jsx("p", { className: "text-slate-300", children: "Status" })] })] })] })] }), _jsxs("section", { className: "grid gap-6 xl:grid-cols-12", children: [_jsx("div", { className: "xl:col-span-8", children: _jsxs("div", { className: "card h-full space-y-5 p-5 md:p-6", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Libris AI Chat" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Ask questions, request summaries, and validate references." })] }), _jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300", children: [_jsx(Clock3, { className: "h-3.5 w-3.5" }), "Online"] })] }), _jsx("div", { ref: transcriptRef, className: "h-[420px] space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/50", children: messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'assistant'
                                                ? 'border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100'
                                                : 'bg-gradient-to-r from-brand-600 to-violet-600 text-white'}`, children: [_jsx("div", { className: "mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]", children: message.role === 'assistant' ? (_jsxs(_Fragment, { children: [_jsx(Bot, { className: "h-3.5 w-3.5" }), "Libris AI"] })) : (_jsxs(_Fragment, { children: [_jsx(UserRound, { className: "h-3.5 w-3.5" }), "You"] })) }), _jsx("p", { className: "text-sm leading-relaxed", children: message.text }), _jsx("p", { className: `mt-2 text-right text-[11px] ${message.role === 'assistant' ? 'text-slate-500 dark:text-slate-400' : 'text-white/70'}`, children: message.timestamp })] }) }, message.id))) }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: quickPrompts.map((prompt) => (_jsx("button", { type: "button", onClick: () => applyPrompt(prompt), className: "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-brand-400", children: prompt }, prompt))) }), _jsxs("form", { onSubmit: handleSubmit, className: "rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900", children: [_jsx("label", { htmlFor: "libris-ai-prompt", className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400", children: "Message" }), _jsxs("div", { className: "flex items-end gap-2", children: [_jsx("textarea", { id: "libris-ai-prompt", ref: composerRef, value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "Ask Libris AI anything about your library resources...", className: "input-modern min-h-[72px] resize-none border-slate-200 text-sm dark:border-white/10" }), _jsxs("div", { className: "flex shrink-0 items-center gap-2 pb-1", children: [_jsx("button", { type: "button", className: "btn-icon border border-slate-200 bg-white text-slate-600 hover:text-brand-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300", children: _jsx(Mic, { className: "h-4 w-4" }) }), _jsxs("button", { type: "submit", className: "btn-primary px-4 py-3 text-sm", children: ["Send", _jsx(SendHorizontal, { className: "h-4 w-4" })] })] })] })] })] })] }) }), _jsxs("div", { className: "space-y-6 xl:col-span-4", children: [_jsxs("div", { className: "card space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "rounded-xl bg-brand-100 p-2 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300", children: _jsx(MessageSquareText, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white", children: "Session Summary" }), _jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Current conversation insights" })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800", children: [_jsx("p", { className: "text-lg font-bold text-slate-900 dark:text-white", children: messageCount.user }), _jsx("p", { className: "text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400", children: "User" })] }), _jsxs("div", { className: "rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800", children: [_jsx("p", { className: "text-lg font-bold text-slate-900 dark:text-white", children: messageCount.assistant }), _jsx("p", { className: "text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400", children: "AI" })] }), _jsxs("div", { className: "rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800", children: [_jsx("p", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "A+" }), _jsx("p", { className: "text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400", children: "Quality" })] })] })] }), _jsxs("div", { className: "card space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-4 w-4 text-brand-600 dark:text-brand-400" }), _jsx("h3", { className: "text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white", children: "Linked Sources" })] }), _jsx("div", { className: "space-y-2.5", children: sourceCards.map((source) => (_jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800/70", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: source.title }), _jsx("p", { className: "mt-1 text-xs text-slate-600 dark:text-slate-400", children: source.chapter }), _jsx("p", { className: "mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300", children: source.confidence })] }, source.title))) })] }), _jsxs("div", { className: "card space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-4 w-4 text-violet-600 dark:text-violet-400" }), _jsx("h3", { className: "text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white", children: "Integration Notes" })] }), _jsxs("ul", { className: "space-y-2 text-sm text-slate-700 dark:text-slate-300", children: [_jsx("li", { className: "rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800", children: "Connect your `/ai/chat` API in `handleSubmit`." }), _jsx("li", { className: "rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800", children: "Map your backend response to `ChatMessage`." }), _jsx("li", { className: "rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800", children: "Attach real citation metadata to source cards." })] }), _jsxs("button", { type: "button", className: "btn-secondary w-full justify-center", children: ["Open Integration Docs", _jsx(ArrowRight, { className: "h-4 w-4" })] })] })] })] })] }));
};
export default LibrisAIPage;

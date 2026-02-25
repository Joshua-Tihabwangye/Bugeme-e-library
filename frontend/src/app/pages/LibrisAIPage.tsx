import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Clock3,
  Database,
  FileText,
  MessageSquareText,
  Mic,
  SendHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react';

type ChatRole = 'assistant' | 'user';

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
  timestamp: string;
};

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
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = transcriptRef.current;
    if (panel) {
      panel.scrollTop = panel.scrollHeight;
    }
  }, [messages]);

  const messageCount = useMemo(
    () => ({
      assistant: messages.filter((m) => m.role === 'assistant').length,
      user: messages.filter((m) => m.role === 'user').length,
      total: messages.length,
    }),
    [messages],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextId = messages[messages.length - 1]?.id ?? 0;

    const userMessage: ChatMessage = {
      id: nextId + 1,
      role: 'user',
      text: prompt,
      timestamp: time,
    };

    const assistantMessage: ChatMessage = {
      id: nextId + 2,
      role: 'assistant',
      text: 'UI is ready. Connect your API in this submit handler and replace this placeholder response with your real Libris AI output.',
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft('');
    composerRef.current?.focus();
  };

  const applyPrompt = (prompt: string) => {
    setDraft(prompt);
    composerRef.current?.focus();
  };

  return (
    <div className="space-y-8 animate-in">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-8 text-white shadow-2xl shadow-slate-900/30 dark:border-white/10">
        <div className="absolute -right-10 top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 left-12 h-32 w-32 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em]">
              <Sparkles className="h-4 w-4" />
              Libris AI Workspace
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Professional conversational UI for your library intelligence system
            </h1>
            <p className="text-sm leading-relaxed text-slate-200 md:text-base">
              Designed for summaries, citations, and contextual guidance with a clear integration path to your own
              AI backend.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center">
              <p className="font-semibold text-white">{messageCount.total}</p>
              <p className="text-slate-300">Messages</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center">
              <p className="font-semibold text-white">{sourceCards.length}</p>
              <p className="text-slate-300">Sources</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center">
              <p className="font-semibold text-white">Live</p>
              <p className="text-slate-300">Status</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="card h-full space-y-5 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Libris AI Chat</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ask questions, request summaries, and validate references.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Clock3 className="h-3.5 w-3.5" />
                Online
              </div>
            </div>

            <div
              ref={transcriptRef}
              className="h-[420px] space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/50"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'assistant'
                        ? 'border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100'
                        : 'bg-gradient-to-r from-brand-600 to-violet-600 text-white'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                      {message.role === 'assistant' ? (
                        <>
                          <Bot className="h-3.5 w-3.5" />
                          Libris AI
                        </>
                      ) : (
                        <>
                          <UserRound className="h-3.5 w-3.5" />
                          You
                        </>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`mt-2 text-right text-[11px] ${
                        message.role === 'assistant' ? 'text-slate-500 dark:text-slate-400' : 'text-white/70'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => applyPrompt(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                <label htmlFor="libris-ai-prompt" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Message
                </label>
                <div className="flex items-end gap-2">
                  <textarea
                    id="libris-ai-prompt"
                    ref={composerRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask Libris AI anything about your library resources..."
                    className="input-modern min-h-[72px] resize-none border-slate-200 text-sm dark:border-white/10"
                  />
                  <div className="flex shrink-0 items-center gap-2 pb-1">
                    <button
                      type="button"
                      className="btn-icon border border-slate-200 bg-white text-slate-600 hover:text-brand-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <button type="submit" className="btn-primary px-4 py-3 text-sm">
                      Send
                      <SendHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <div className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brand-100 p-2 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white">
                  Session Summary
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Current conversation insights</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{messageCount.user}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">User</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{messageCount.assistant}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">AI</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
                <p className="text-lg font-bold text-slate-900 dark:text-white">A+</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Quality</p>
              </div>
            </div>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white">
                Linked Sources
              </h3>
            </div>
            <div className="space-y-2.5">
              {sourceCards.map((source) => (
                <div
                  key={source.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800/70"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{source.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{source.chapter}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300">
                    {source.confidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-white">
                Integration Notes
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">Connect your `/ai/chat` API in `handleSubmit`.</li>
              <li className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">Map your backend response to `ChatMessage`.</li>
              <li className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">Attach real citation metadata to source cards.</li>
            </ul>
            <button type="button" className="btn-secondary w-full justify-center">
              Open Integration Docs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LibrisAIPage;

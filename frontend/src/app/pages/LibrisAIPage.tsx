import { FormEvent, useMemo, useRef, useState } from 'react';
import { BookOpen, Clock3, Search, SendHorizontal, Sparkles } from 'lucide-react';

type ChatRole = 'assistant' | 'user';

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
  timestamp: string;
};

const quickActions = ['Summarize this chapter', 'Find related resources', 'Create revision questions'];

const LibrisAIPage = () => {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Welcome. Ask anything about your library resources and study content.',
      timestamp: '09:40',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  const recentUserPrompts = useMemo(
    () =>
      messages
        .filter((message) => message.role === 'user')
        .map((message) => message.text)
        .slice(-4)
        .reverse(),
    [messages],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt) return;

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

  const applyQuickAction = (prompt: string) => {
    setDraft(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <section className="space-y-3 text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          Libris AI
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">Start Simple</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
          Ask a clear question, get a focused answer, and move quickly.
        </p>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-2">
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => applyQuickAction(action)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/15 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
          >
            {action}
          </button>
        ))}
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message Libris..."
            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                <BookOpen className="h-3.5 w-3.5" />
                Library
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                <Search className="h-3.5 w-3.5" />
                Search
              </span>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Send
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Recent Activity
        </h2>

        {recentUserPrompts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No recent prompts yet.</p>
        ) : (
          <div className="space-y-2">
            {recentUserPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => applyQuickAction(prompt)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              >
                <span className="truncate">{prompt}</span>
                <Clock3 className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibrisAIPage;

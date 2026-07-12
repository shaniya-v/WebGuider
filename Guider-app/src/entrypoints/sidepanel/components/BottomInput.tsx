import { useSidebarStore } from '../stores/sidebarStore';

export function BottomInput() {
  const { mode, inputValue, isLoading, setInputValue, addMessage, setLoading } =
    useSidebarStore();

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    if (mode === 'tutor') {
      const text = inputValue.trim();
      addMessage('user', text);
      setLoading(true);
      setInputValue('');

      setTimeout(() => {
        addMessage(
          'assistant',
          `Great question about **${text}**! Let me explain...

Here's what you need to know:

1. **Core Concept** — This is a fundamental topic in modern development
2. **Key Benefits** — Improved productivity and better results
3. **Getting Started** — Practice with small examples first

> *"Continuous learning is the key to mastery."*

Would you like me to go deeper into this topic?`
        );
        setLoading(false);
      }, 2000);
    } else {
      browser.runtime.sendMessage({
        type: 'EXPLORE_QUERY',
        query: inputValue.trim(),
      });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200/80 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'tutor' ? 'Ask anything...' : 'What do you want to do?'}
            disabled={isLoading}
            className="w-full px-4 py-2.5 pr-10 text-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => {}}
            className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Attach"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {}}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Voice input"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
          title="Send"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../stores/sidebarStore';
import type { ExplorerStatus } from '../stores/sidebarStore';

const statusConfig: Record<ExplorerStatus, { label: string; color: string; icon: string }> = {
  idle: { label: 'Ready', color: 'bg-gray-400', icon: '○' },
  analyzing: { label: 'Analyzing Page', color: 'bg-blue-500', icon: '◌' },
  waiting: { label: 'Waiting for action', color: 'bg-amber-500', icon: '◎' },
  completed: { label: 'Completed', color: 'bg-green-500', icon: '✓' },
  error: { label: 'Error', color: 'bg-red-500', icon: '✕' },
};

function renderInline(text: string) {
  const parts: JSX.Element[] = [];
  let idx = 0;
  const regex = /(\*\*(.+?)\*\*)/g;
  let match;
  let lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={idx++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={idx++} className="font-semibold text-gray-900 dark:text-gray-100">
        {match[2]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={idx++}>{text.slice(lastIndex)}</span>);
  }
  return parts.length > 0 ? <>{parts}</> : <>{text}</>;
}

function renderMessage(content: string) {
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      return (
        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 ml-4">
          {renderInline(trimmed.slice(2))}
        </li>
      );
    }
    if (trimmed === '') return <div key={i} className="h-1" />;
    return (
      <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {renderInline(trimmed)}
      </p>
    );
  });
}

export function ActionPanel() {
  const {
    goal, setGoal, submitUserInput, resetExploration, analyzeCurrentPage,
    currentInstruction, aiReasoning, explorerStatus, confidence,
    completedSteps, currentPageTitle, pageUrl, domain,
    messages, lastIntent,
    pageSummary, details, highlightTarget, highlightConfirmed, successMessage,
    exploreSteps, currentStepIndex,
    exploreChatOpen, exploreChatMessages, exploreChatLoading,
    toggleExploreChat, askExploreDoubt,
  } = useSidebarStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const status = statusConfig[explorerStatus] || statusConfig.idle;
  const [chatInput, setChatInput] = useState('');

  const isActive = explorerStatus !== 'idle' && explorerStatus !== 'error';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, explorerStatus, details, exploreChatMessages]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (explorerStatus === 'waiting') {
      interval = setInterval(() => {
        analyzeCurrentPage();
      }, 2000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [explorerStatus]);

  const handleSubmit = () => {
    if (!goal.trim()) return;
    submitUserInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleChatSend = () => {
    if (!chatInput.trim() || exploreChatLoading) return;
    askExploreDoubt(chatInput.trim());
    setChatInput('');
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleChatSend();
  };

  const showChat = lastIntent === 'conversation' || lastIntent === 'unclear';
  const hasChatMessages = showChat && messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        {!isActive ? (
          <div className="px-4 py-4 space-y-4">
            {explorerStatus !== 'error' && !hasChatMessages && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 pb-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
                  🔍
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Explore any website
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tell me what you want to do, and I'll guide you step by step
                </p>
              </motion.div>
            )}

            {hasChatMessages && (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.slice(-4).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary-500 text-white rounded-br-sm shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200/50 dark:border-gray-700/30'
                        }`}
                      >
                        {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                        <div
                          className={`text-[10px] mt-1.5 ${
                            msg.role === 'user' ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}

            {explorerStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
              >
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠</span>
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Analysis failed</p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{currentInstruction}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <input
                ref={inputRef}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Help me login, Book a ticket, Create an account..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-shadow"
              />
              <button
                onClick={handleSubmit}
                disabled={!goal.trim()}
                className="w-full py-2.5 text-sm font-medium rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={explorerStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {explorerStatus === 'analyzing' && (
                      <span className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    {status.label}
                  </h3>
                  <button
                    onClick={() => {
                      resetExploration();
                      browser.runtime.sendMessage({ type: 'STOP_GUIDE' }).catch(() => {});
                    }}
                    className="text-[11px] text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Stop
                  </button>
                </div>

                {domain && (
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                    <span>📍</span>
                    <span className="truncate">{domain}</span>
                    {pageUrl && <span className="truncate text-gray-300 dark:text-gray-600">→ {pageUrl}</span>}
                  </div>
                )}

                {explorerStatus === 'analyzing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 space-y-3"
                  >
                    <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Inspecting page and analyzing your request...
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Reading DOM structure · Identifying elements · Planning next step
                      </p>
                    </div>
                  </motion.div>
                )}

                {explorerStatus === 'waiting' && currentInstruction && (
                  <>
                    {pageSummary && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-100 dark:border-primary-800/30 p-4"
                      >
                        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                          {renderInline(pageSummary)}
                        </p>
                      </motion.div>
                    )}

                    <div className="rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-4">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-2">
                        {aiReasoning || 'Current Step'}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                        {renderInline(currentInstruction)}
                      </p>
                    </div>

                    {details.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Steps to follow
                        </p>
                        <div className="space-y-2">
                          {details.map((detail, i) => {
                            const stepInfo = exploreSteps[i];
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`rounded-lg border p-3 ${
                                  i === currentStepIndex
                                    ? 'bg-primary-50/70 dark:bg-primary-900/15 border-primary-200/70 dark:border-primary-700/40'
                                    : 'bg-white dark:bg-gray-800/30 border-gray-100 dark:border-gray-700/20'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                                    i === currentStepIndex
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {i + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className={`text-sm leading-relaxed ${
                                      i === currentStepIndex
                                        ? 'text-gray-900 dark:text-gray-100 font-medium'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                      {renderInline(detail.replace(/^\d+\.\s*/, ''))}
                                    </span>
                                    {stepInfo?.reasoning && i === currentStepIndex && (
                                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                                        {stepInfo.reasoning}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {highlightTarget && (
                      <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border ${
                        highlightConfirmed
                          ? 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/30'
                          : 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30'
                      }`}>
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {highlightConfirmed
                            ? `Element "${highlightTarget.text}" is highlighted on the page`
                            : `Looking for "${highlightTarget.text}" on the page...`
                          }
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${status.color} animate-pulse`} />
                        <span className="text-gray-500 dark:text-gray-400">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 dark:text-gray-500">Confidence</span>
                        <span className={`font-semibold ${
                          confidence >= 80 ? 'text-green-600 dark:text-green-400' :
                          confidence >= 50 ? 'text-amber-600 dark:text-amber-400' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {confidence}%
                        </span>
                      </div>
                    </div>

                    {completedSteps.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Progress ({completedSteps.filter((s) => s.completed).length}/{completedSteps.length})
                        </p>
                        <div className="flex gap-1">
                          {completedSteps.map((step, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-1 rounded-full transition-colors ${
                                step.completed ? 'bg-green-400' : i === currentStepIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="space-y-1 mt-2">
                          {completedSteps.map((step, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                                !step.completed && i === currentStepIndex
                                  ? 'bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30'
                                  : step.completed
                                  ? 'text-gray-500 dark:text-gray-400'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            >
                              <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium ${
                                step.completed
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                  : i === currentStepIndex
                                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                              }`}>
                                {step.completed ? '✓' : i + 1}
                              </span>
                              <span className={step.completed ? 'line-through' : ''}>
                                {step.instruction}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {explorerStatus === 'completed' && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 space-y-3 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Task Complete!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{renderInline(successMessage || currentInstruction)}</p>
                    </div>
                    <button
                      onClick={resetExploration}
                      className="px-4 py-2 text-sm font-medium rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-sm"
                    >
                      New Task
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {isActive && explorerStatus !== 'analyzing' && (
        <div className="border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button
            onClick={toggleExploreChat}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Ask a doubt
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform ${exploreChatOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <AnimatePresence>
            {exploreChatOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
              >
                <div className="max-h-48 overflow-y-auto px-3 py-2 space-y-2">
                  {exploreChatMessages.length === 0 && !exploreChatLoading && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
                      Ask anything about this task — what a step means, what to expect, or for help
                    </p>
                  )}
                  {exploreChatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-xl px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-primary-500 text-white text-xs rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-bl-sm border border-gray-200/50 dark:border-gray-700/30'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {exploreChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-xs text-gray-400 dark:text-gray-500 rounded-bl-sm border border-gray-200/50 dark:border-gray-700/30">
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <input
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Ask a doubt..."
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500/40"
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || exploreChatLoading}
                    className="shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}



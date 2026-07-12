import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../stores/sidebarStore';

function TypingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function ChatArea() {
  const { messages, isLoading, addMessage, setLoading, inputValue, setInputValue, suggestions } =
    useSidebarStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestion = (text: string) => {
    setInputValue(text);
    addMessage('user', text);
    setLoading(true);
    setTimeout(() => {
      addMessage(
        'assistant',
        `Great question about **${text}**! Let me explain...

This is a fundamental concept in modern software development. Here's what you need to know:

1. **Core Concept** — It's a way to build and manage applications efficiently
2. **Key Benefits** — Scalability, maintainability, and developer productivity
3. **Best Practices** — Start small, iterate often, and use the right tools

> *"The best way to learn is by doing."*

Would you like me to dive deeper into any specific aspect?`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-primary-200/50 dark:shadow-primary-900/30">
            W
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            How can I help you?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask me anything about technology, coding, or websites
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-3 py-1.5 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all border border-gray-200/50 dark:border-gray-700/50"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {messages.map((msg) => (
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
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.role === 'assistant' ? (
                  <AssistantMessage content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
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

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-200/50 dark:border-gray-700/30">
            <TypingDots />
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inList = false;
  let inBlockquote = false;
  let listItems: string[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('> ')) {
      if (!inBlockquote) {
        inBlockquote = true;
        elements.push(
          <blockquote key={i} className="border-l-2 border-primary-400 pl-3 my-2 text-gray-600 dark:text-gray-400 italic text-sm">
            {trimmed.slice(2)}
          </blockquote>
        );
      } else {
        elements.push(
          <span key={i}>{trimmed.slice(2)}</span>
        );
      }
      return;
    }
    inBlockquote = false;

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
      inList = true;
      return;
    }
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-0.5 my-1.5 text-sm">
          {listItems.map((item, j) => (
            <li key={j} className="text-gray-700 dark:text-gray-300">{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }

    if (trimmed === '') {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside space-y-0.5 my-1.5 text-sm">
            {listItems.map((item, j) => (
              <li key={j} className="text-gray-700 dark:text-gray-300">{renderInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      elements.push(<div key={`br-${i}`} className="h-2" />);
      return;
    }

    if (!inList) {
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  if (listItems.length > 0) {
    elements.push(
      <ul key="ul-final" className="list-disc list-inside space-y-0.5 my-1.5 text-sm">
        {listItems.map((item, j) => (
          <li key={j} className="text-gray-700 dark:text-gray-300">{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  return <>{elements}</>;
}

function renderInline(text: string) {
  const parts: JSX.Element[] = [];
  let remaining = text;
  let idx = 0;

  const regex = /(\*\*(.+?)\*\*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={idx++}>{remaining.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={idx++} className="font-semibold text-gray-900 dark:text-gray-100">
        {match[2]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < remaining.length) {
    parts.push(<span key={idx++}>{remaining.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : <>{text}</>;
}

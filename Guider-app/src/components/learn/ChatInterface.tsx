import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnStore } from '../../stores/learnStore';
import { askAI } from '../../lib/ai';
import { formatTime } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ChatInterface() {
  const { messages, addMessage, isLoading, setLoading } = useLearnStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const query = input.trim();
    setInput('');
    addMessage('user', query);
    setLoading(true);
    const response = await askAI(query, messages.map((m) => m.content));
    addMessage('assistant', response);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              What would you like to learn?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me about any technology, programming concept, or tool.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['Explain Docker', 'What is Kubernetes?', 'Learn React', 'Teach me Git'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="px-3 py-1.5 text-sm rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-md'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-primary-200' : 'text-gray-400'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="md">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

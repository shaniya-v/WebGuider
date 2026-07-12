import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { ActionPanel } from './components/ActionPanel';
import { BottomInput } from './components/BottomInput';
import { useSidebarStore } from './stores/sidebarStore';

const tabs: { id: 'tutor' | 'explore'; label: string; icon: string }[] = [
  { id: 'explore', label: 'Explore', icon: '🔍' },
  { id: 'tutor', label: 'Tutor', icon: '🎓' },
];

export default function App() {
  const { mode, isActive, setMode, setDomain } = useSidebarStore();

  useEffect(() => {
    (async () => {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (tab?.url) {
          try {
            setDomain(new URL(tab.url).hostname);
          } catch {
            setDomain(tab.url || '');
          }
        }
      } catch {
        setDomain('');
      }
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <Header />

      <div className="flex border-b border-gray-200/80 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative ${
              mode === tab.id
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
            {mode === tab.id && (
              <motion.div
                layoutId="modeTab"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'tutor' ? (
          <motion.div
            key="tutor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <ChatArea />
            <BottomInput />
          </motion.div>
        ) : (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <ActionPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

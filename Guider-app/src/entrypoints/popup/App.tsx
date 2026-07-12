import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../../stores/appStore';
import { ModeSelector } from './components/ModeSelector';
import { LearnPage } from './components/LearnPage';
import { ExplorePage } from './components/ExplorePage';
import { motion, AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

function AppContent() {
  const { mode, toggleMode } = useAppStore();

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white dark:bg-gray-900">
      <ModeSelector />

      <div className="flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {mode === 'learn' ? (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <LearnPage />
            </motion.div>
          ) : (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ExplorePage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            mode === 'learn'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            Learn
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            mode === 'explore'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            Explore
          </span>
        </div>
        <button
          onClick={toggleMode}
          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Switch Mode
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

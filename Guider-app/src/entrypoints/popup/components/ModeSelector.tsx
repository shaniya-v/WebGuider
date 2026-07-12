import { motion } from 'framer-motion';
import { useAppStore } from '../../../stores/appStore';
import type { Mode } from '../../../types';

const modes: { id: Mode; title: string; description: string; icon: string }[] = [
  {
    id: 'learn',
    title: 'Learn Mode',
    description: 'Understand concepts, technologies, and tools',
    icon: '🎓',
  },
  {
    id: 'explore',
    title: 'Explore Mode',
    description: 'Get guided through websites interactively',
    icon: '🔍',
  },
];

export function ModeSelector() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="p-4 space-y-3">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Web-Guider</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Learn concepts. Master websites.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode(m.id)}
            className={`relative rounded-xl p-4 text-left transition-all ${
              mode === m.id
                ? 'bg-primary-50 border-2 border-primary-500 dark:bg-primary-900/30 dark:border-primary-400'
                : 'bg-white border-2 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">{m.icon}</div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{m.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.description}</p>
            {mode === m.id && (
              <motion.div
                layoutId="activeMode"
                className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

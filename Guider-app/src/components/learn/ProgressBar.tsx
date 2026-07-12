import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export function ProgressBar({ progress, showLabel }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          />
        </div>
        {showLabel && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
            {progress}%
          </span>
        )}
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
}

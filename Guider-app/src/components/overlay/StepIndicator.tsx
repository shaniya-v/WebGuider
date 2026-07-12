import { AnimatePresence, motion } from 'framer-motion';
import type { ExploreStep } from '../../types';

interface StepIndicatorProps {
  steps: ExploreStep[];
  currentIndex: number;
  visible: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function StepIndicator({
  steps,
  currentIndex,
  visible,
  onNext,
  onPrev,
  onExit,
}: StepIndicatorProps) {
  const currentStep = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  return (
    <AnimatePresence>
      {visible && currentStep && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2147483647] w-[90vw] max-w-lg"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Step {currentIndex + 1} of {steps.length}
              </span>
              <button
                onClick={onExit}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
              >
                Exit Guide
              </button>
            </div>

            <div className="flex gap-1 mb-3">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full ${
                    i === currentIndex
                      ? 'bg-primary-500'
                      : i < currentIndex
                      ? 'bg-accent-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-900 dark:text-gray-100 mb-4">
              {currentStep.instruction}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <button
                onClick={onNext}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                {isLast ? 'Complete' : 'Next'}
              </button>
            </div>

            {currentStep.action === 'wait' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Waiting for action...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

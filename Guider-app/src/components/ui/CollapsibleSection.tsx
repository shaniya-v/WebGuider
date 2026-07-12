import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  badge?: string | number;
  actions?: ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  icon,
  badge,
  actions,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <motion.span
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.15 }}
          className="text-[10px]"
        >
          ▼
        </motion.span>
        {icon && <span className="text-sm">{icon}</span>}
        <span className="flex-1 text-left">{title}</span>
        {badge != null && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
            {badge}
          </span>
        )}
        {actions && <span className="ml-auto">{actions}</span>}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

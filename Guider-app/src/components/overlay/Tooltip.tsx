import { motion } from 'framer-motion';

interface TooltipProps {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

export function Tooltip({ text, x, y, visible }: TooltipProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-[2147483647] pointer-events-none"
      style={{ top: y, left: x }}
    >
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-3 py-2 rounded-lg shadow-lg max-w-[300px]">
        <div className="relative">
          {text}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}

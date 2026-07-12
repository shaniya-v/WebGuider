import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HighlightOverlayProps {
  selector: string;
  visible: boolean;
}

export function HighlightOverlay({ selector, visible }: HighlightOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!visible || !selector) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(selector);
      if (el) {
        setRect(el.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [selector, visible]);

  return (
    <AnimatePresence>
      {visible && rect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed pointer-events-none z-[2147483646]"
          style={{
            top: rect.top + window.scrollY - 4,
            left: rect.left + window.scrollX - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        >
          <div className="w-full h-full rounded-lg border-2 border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-pulse-slow" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

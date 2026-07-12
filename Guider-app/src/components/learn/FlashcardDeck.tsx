import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlashCard } from '../../types';
import { Button } from '../ui/Button';

interface FlashcardDeckProps {
  cards: FlashCard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[current];

  if (!card) return null;

  const handleNext = () => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Card {current + 1} of {cards.length}
        </span>
        <span className="text-xs text-gray-400">Tap to flip</span>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? 'back' : 'front'}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm min-h-[200px] flex items-center justify-center text-center"
          >
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {flipped ? card.back : card.front}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handlePrev} className="flex-1">
          Previous
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}

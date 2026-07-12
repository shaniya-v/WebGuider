import { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../../types';
import { Button } from '../ui/Button';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const question = questions[current];
  const selected = answers[current];

  const handleSelect = (index: number) => {
    if (answers[current] !== undefined) return;
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const score = answers.filter((a, i) => a === questions[i].correctAnswer).length;
      setShowResults(true);
      onComplete?.(score);
    }
  };

  if (showResults) {
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-5xl mb-4">{score === questions.length ? '🎉' : '💪'}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {score === questions.length ? 'Perfect Score!' : 'Quiz Complete'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You got {score} out of {questions.length} correct ({Math.round((score / questions.length) * 100)}%)
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => {
            setCurrent(0);
            setAnswers([]);
            setShowResults(false);
          }}
        >
          Retry Quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {current + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === current
                  ? 'bg-primary-500'
                  : answers[i] !== undefined
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
        <p className="font-medium text-gray-900 dark:text-gray-100">{question.question}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = question.correctAnswer === i;
          const showAnswer = selected !== undefined;

          let borderClass = 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600';
          if (showAnswer && isCorrect) borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500';
          else if (showAnswer && isSelected && !isCorrect) borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500';
          else if (isSelected) borderClass = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== undefined}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${borderClass}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm mt-0.5 font-medium text-gray-500 dark:text-gray-400 w-5">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{option}</span>
                {showAnswer && isCorrect && <span className="ml-auto text-green-600">✓</span>}
                {showAnswer && isSelected && !isCorrect && <span className="ml-auto text-red-600">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-gray-700 dark:text-gray-300"
        >
          {question.explanation}
        </motion.div>
      )}

      {selected !== undefined && (
        <Button onClick={handleNext} className="w-full">
          {current < questions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      )}
    </div>
  );
}

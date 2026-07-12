import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExploreStore } from '../../../stores/exploreStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { generateId } from '../../../lib/utils';

const suggestions = [
  'Create a repository on GitHub',
  'Create a Virtual Machine on Azure',
  'Update my LinkedIn profile',
  'Deploy a website on Vercel',
];

export function ExplorePage() {
  const {
    goal,
    steps,
    currentStepIndex,
    isActive,
    isAnalyzing,
    setGoal,
    setSteps,
    setActive,
    setAnalyzing,
    nextStep,
    prevStep,
    reset,
  } = useExploreStore();

  const [inputValue, setInputValue] = useState('');

  const handleStart = async () => {
    const query = inputValue.trim() || goal;
    if (!query) return;

    setGoal(query);
    setActive(true);
    setAnalyzing(true);

    // Simulate AI DOM analysis - in production this calls the backend
    setTimeout(() => {
      const mockSteps = generateMockSteps(query);
      setSteps(mockSteps);
      setAnalyzing(false);

      // Send message to content script to start guide
      browser.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.sendMessage(tabs[0].id, {
            type: 'START_GUIDE',
            steps: mockSteps,
          });
        }
      });
    }, 2000);
  };

  const handleNext = () => {
    nextStep();
    if (currentStepIndex < steps.length - 1) {
      const nextStepData = steps[currentStepIndex + 1];
      browser.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.sendMessage(tabs[0].id, {
            type: 'HIGHLIGHT_STEP',
            step: nextStepData,
          });
        }
      });
    }
  };

  const handlePrev = () => {
    prevStep();
    const prevStepData = steps[currentStepIndex - 1];
    browser.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        browser.tabs.sendMessage(tabs[0].id, {
          type: 'HIGHLIGHT_STEP',
          step: prevStepData,
        });
      }
    });
  };

  const handleExit = () => {
    browser.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        browser.tabs.sendMessage(tabs[0].id, { type: 'STOP_GUIDE' });
      }
    });
    reset();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Explore Mode
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tell me what you want to do on any website
              </p>
            </div>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., Create a GitHub repository"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />

            <Button onClick={handleStart} className="w-full" disabled={!inputValue.trim()}>
              Start Guide
            </Button>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInputValue(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analyzing Website</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Understanding the page structure...
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              {['Reading DOM structure', 'Identifying interactive elements', 'Planning navigation steps'].map(
                (step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${i <= 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
                    {step}
                  </div>
                )
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Active Guide</h3>
              <button
                onClick={handleExit}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Stop
              </button>
            </div>

            <div className="rounded-xl bg-primary-50 dark:bg-primary-900/30 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{goal}</p>
            </div>

            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i === currentStepIndex
                      ? 'bg-primary-500'
                      : i < currentStepIndex
                      ? 'bg-accent-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    i === currentStepIndex
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500'
                      : i < currentStepIndex
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                        i === currentStepIndex
                          ? 'bg-primary-500 text-white'
                          : i < currentStepIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {i < currentStepIndex ? '✓' : i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step.instruction}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStepIndex === steps.length - 1}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateMockSteps(goal: string): import('../../../types').ExploreStep[] {
  const id = () => generateId();
  if (goal.toLowerCase().includes('github') || goal.toLowerCase().includes('repository')) {
    return [
      { id: id(), instruction: 'Click the "+" icon in the top-right corner', selector: '[aria-label="Create new"]', action: 'click' },
      { id: id(), instruction: 'Select "New repository" from the dropdown', selector: 'a[href="/new"]', action: 'click' },
      { id: id(), instruction: 'Enter a repository name', selector: '#repository_name', action: 'input', value: 'my-new-project' },
      { id: id(), instruction: 'Add a description (optional)', selector: '#repository_description', action: 'input', value: 'A great project' },
      { id: id(), instruction: 'Choose Public or Private', selector: '[name="repository_visibility"]', action: 'click' },
      { id: id(), instruction: 'Click "Create repository"', selector: 'button:contains("Create repository")', action: 'click' },
    ];
  }
  if (goal.toLowerCase().includes('linkedin') || goal.toLowerCase().includes('profile')) {
    return [
      { id: id(), instruction: 'Click on "Me" icon in the top navigation', selector: '[data-control-name="identity_profile_photo"]', action: 'click' },
      { id: id(), instruction: 'Select "View Profile"', selector: 'a[href*="/in/"]', action: 'click' },
      { id: id(), instruction: 'Click the "Edit" button on your profile', selector: 'button:contains("Edit")', action: 'click' },
      { id: id(), instruction: 'Update your profile headline', selector: '#headline', action: 'input', value: 'Software Developer' },
      { id: id(), instruction: 'Click "Save" to apply changes', selector: 'button:contains("Save")', action: 'click' },
    ];
  }
  return [
    { id: id(), instruction: 'Navigate to the main action area', selector: 'main', action: 'highlight' },
    { id: id(), instruction: 'Click the primary action button', selector: 'button:first-of-type', action: 'click' },
    { id: id(), instruction: 'Fill in the required details', selector: 'input:first-of-type', action: 'input', value: 'Sample input' },
    { id: id(), instruction: 'Confirm and submit', selector: '[type="submit"]', action: 'click' },
  ];
}

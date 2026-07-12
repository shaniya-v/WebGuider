import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../stores/sidebarStore';

const statusLabels: Record<string, { label: string; color: string }> = {
  idle: { label: 'Ready', color: 'bg-gray-400' },
  searching: { label: 'Searching', color: 'bg-blue-500' },
  clicking: { label: 'Clicking', color: 'bg-amber-500' },
  waiting: { label: 'Waiting', color: 'bg-purple-500' },
  done: { label: 'Complete', color: 'bg-green-500' },
};

const exploreSuggestions = [
  'Create a repository on GitHub',
  'Update my LinkedIn profile',
  'Deploy a site on Vercel',
  'Create a VM on Azure',
];

export function ActionPanel() {
  const {
    goal,
    steps,
    currentStepIndex,
    isActive,
    isAnalyzing,
    automationStatus,
    confidence,
    inputValue,
    setInputValue,
    setGoal,
    setSteps,
    setActive,
    setAnalyzing,
    setAutomationStatus,
    setConfidence,
    nextStep,
    prevStep,
    reset,
  } = useSidebarStore();

  const status = statusLabels[automationStatus] || statusLabels.idle;

  const handleStart = () => {
    const query = inputValue.trim();
    if (!query) return;

    setGoal(query);
    setActive(true);
    setAnalyzing(true);
    setAutomationStatus('searching');
    setConfidence(65);

    setTimeout(() => {
      const mockSteps = generateMockSteps(query);
      setSteps(mockSteps);
      setAnalyzing(false);
      setAutomationStatus('idle');
      setConfidence(92);

      browser.runtime.sendMessage({ type: 'START_GUIDE', steps: mockSteps });
    }, 2000);
  };

  const handleNext = () => {
    nextStep();
    setAutomationStatus('clicking');
    setTimeout(() => setAutomationStatus('idle'), 800);
    if (currentStepIndex < steps.length - 1) {
      browser.runtime.sendMessage({ type: 'HIGHLIGHT_STEP', step: steps[currentStepIndex + 1] });
    }
  };

  const handlePrev = () => {
    prevStep();
    if (currentStepIndex > 0) {
      browser.runtime.sendMessage({ type: 'HIGHLIGHT_STEP', step: steps[currentStepIndex - 1] });
    }
  };

  const handleExit = () => {
    browser.runtime.sendMessage({ type: 'STOP_GUIDE' });
    reset();
  };

  if (!isActive) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
            🔍
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Explore any website
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tell me what you want to do, and I'll guide you step by step
          </p>

          <div className="mt-6 space-y-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="e.g., Create a GitHub repository..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-shadow"
            />
            <button
              onClick={handleStart}
              disabled={!inputValue.trim()}
              className="w-full py-2.5 text-sm font-medium rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Start Guide
            </button>
          </div>

          <div className="mt-6">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-medium">
              Try these
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exploreSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInputValue(s)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all border border-gray-200/50 dark:border-gray-700/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analyzing page</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Understanding the structure...
            </p>
          </div>
          <div className="space-y-2 max-w-[200px] mx-auto">
            {['Reading DOM', 'Finding elements', 'Planning steps'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <div className={`w-1.5 h-1.5 rounded-full ${i <= 1 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                {step}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Active Guide</h3>
          <button
            onClick={handleExit}
            className="text-[11px] text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Stop
          </button>
        </div>

        <div className="rounded-xl bg-primary-50/80 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 p-3">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">
            Goal
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{goal}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${status.color} ${automationStatus !== 'idle' ? 'animate-pulse' : ''}`} />
            <span className="text-gray-500 dark:text-gray-400">{status.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 dark:text-gray-500">Confidence</span>
            <span className={`font-semibold ${
              confidence >= 80 ? 'text-green-600 dark:text-green-400' :
              confidence >= 50 ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {confidence}%
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i === currentStepIndex
                  ? 'bg-primary-500'
                  : i < currentStepIndex
                  ? 'bg-green-400'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="space-y-1.5">
          <AnimatePresence>
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-3 rounded-xl border transition-all ${
                  i === currentStepIndex
                    ? 'border-primary-400 bg-primary-50/70 dark:bg-primary-900/15 dark:border-primary-600/50 shadow-sm'
                    : i < currentStepIndex
                    ? 'border-green-200 bg-green-50/70 dark:border-green-800/30 dark:bg-green-900/10'
                    : 'border-gray-200/70 dark:border-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full text-[11px] flex items-center justify-center font-semibold shrink-0 ${
                      i === currentStepIndex
                        ? 'bg-primary-500 text-white'
                        : i < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={`text-sm ${
                    i === currentStepIndex
                      ? 'text-gray-900 dark:text-gray-100 font-medium'
                      : i < currentStepIndex
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.instruction}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex-1 py-2 px-3 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex-1 py-2 px-3 text-sm font-medium rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function generateMockSteps(goal: string): import('../stores/sidebarStore').AutomationStep[] {
  const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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

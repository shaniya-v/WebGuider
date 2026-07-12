import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnStore } from '../../../stores/learnStore';
import { ChatInterface } from '../../../components/learn/ChatInterface';
import { TopicList } from '../../../components/learn/TopicList';
import { ResourceList } from '../../../components/learn/ResourceList';
import { Quiz } from '../../../components/learn/Quiz';
import { FlashcardDeck } from '../../../components/learn/FlashcardDeck';
import { ProgressBar } from '../../../components/learn/ProgressBar';

type LearnTab = 'chat' | 'topics';

export function LearnPage() {
  const [activeTab, setActiveTab] = useState<LearnTab>('chat');
  const {
    currentTopic,
    setCurrentTopic,
    topics,
    quiz,
    flashcards,
    updateTopicProgress,
  } = useLearnStore();

  const activeTopic = topics.find((t) => t.id === currentTopic);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'chat'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'topics'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Topics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'chat' ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col"
          >
            <ChatInterface />
          </motion.div>
        ) : (
          <motion.div
            key="topics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4"
          >
            {activeTopic ? (
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentTopic(null)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  ← Back to topics
                </button>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {activeTopic.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activeTopic.description}
                  </p>
                </div>

                <ProgressBar progress={activeTopic.progress} showLabel />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Learning Path
                  </h3>
                  {activeTopic.subtopics.map((sub, i) => (
                    <div
                      key={sub}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{sub}</span>
                    </div>
                  ))}
                </div>

                {activeTopic.resources.length > 0 && (
                  <ResourceList resources={activeTopic.resources} />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const q = topics.find((t) => t.id === currentTopic);
                      if (q) {
                        useLearnStore.setState({
                          quiz: {
                            id: 'quiz-' + q.id,
                            topicId: q.id,
                            questions: [
                              {
                                id: '1',
                                question: `What is the main purpose of ${q.title}?`,
                                options: [
                                  `To ${q.description}`,
                                  'To manage databases',
                                  'To style web pages',
                                  'To handle networking',
                                ],
                                correctAnswer: 0,
                                explanation: `${q.title} is designed to ${q.description.toLowerCase()}.`,
                              },
                              {
                                id: '2',
                                question: `Which of the following is a key feature of ${q.title}?`,
                                options: [
                                  'Automatic scaling',
                                  `Core ${q.title} functionality`,
                                  'Built-in database',
                                  'Email service',
                                ],
                                correctAnswer: 1,
                                explanation: `The core functionality of ${q.title} focuses on ${q.description.toLowerCase()}.`,
                              },
                            ],
                          },
                        });
                      }
                    }}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => {
                      useLearnStore.setState({
                        flashcards: [
                          {
                            id: '1',
                            front: `What is ${activeTopic.title}?`,
                            back: activeTopic.description,
                            topicId: activeTopic.id,
                          },
                          {
                            id: '2',
                            front: `Key concept in ${activeTopic.title}`,
                            back: `${activeTopic.title} helps developers ${activeTopic.description.toLowerCase()}.`,
                            topicId: activeTopic.id,
                          },
                        ],
                      });
                    }}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100 dark:bg-accent-900/30 dark:text-accent-300 dark:hover:bg-accent-900/50 transition-colors"
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => updateTopicProgress(activeTopic.id, 100)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>

                {quiz && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Quiz
                    </h3>
                    <Quiz
                      questions={quiz.questions}
                      onComplete={(score) => {
                        useLearnStore.setState({ quiz: null });
                        if (score > 0) updateTopicProgress(activeTopic.id, Math.min(activeTopic.progress + 20, 100));
                      }}
                    />
                  </div>
                )}

                {flashcards.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Flashcards
                    </h3>
                    <FlashcardDeck cards={flashcards} />
                  </div>
                )}
              </div>
            ) : (
              <TopicList />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

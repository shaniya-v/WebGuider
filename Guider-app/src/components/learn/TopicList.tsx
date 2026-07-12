import { motion } from 'framer-motion';
import { useLearnStore } from '../../stores/learnStore';
import { ProgressBar } from './ProgressBar';
import { Badge } from '../ui/Badge';

export function TopicList() {
  const { topics, setCurrentTopic } = useLearnStore();

  return (
    <div className="space-y-3">
      {topics.map((topic, index) => (
        <motion.button
          key={topic.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => setCurrentTopic(topic.id)}
          className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{topic.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{topic.description}</p>
            </div>
            <Badge variant={topic.progress === 100 ? 'success' : topic.progress > 0 ? 'info' : 'default'}>
              {topic.progress === 100 ? 'Completed' : topic.progress > 0 ? 'In Progress' : 'Start'}
            </Badge>
          </div>
          <ProgressBar progress={topic.progress} />
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topic.subtopics.slice(0, 4).map((sub) => (
              <span
                key={sub}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                {sub}
              </span>
            ))}
            {topic.subtopics.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                +{topic.subtopics.length - 4}
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

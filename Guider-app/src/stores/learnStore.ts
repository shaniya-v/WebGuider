import { create } from 'zustand';
import type { Message, LearningTopic, Quiz, FlashCard } from '../types';
import { generateId } from '../lib/utils';

interface LearnState {
  messages: Message[];
  currentTopic: string | null;
  topics: LearningTopic[];
  quiz: Quiz | null;
  flashcards: FlashCard[];
  isLoading: boolean;
  error: string | null;

  addMessage: (role: Message['role'], content: string) => void;
  setCurrentTopic: (topic: string | null) => void;
  setTopics: (topics: LearningTopic[]) => void;
  updateTopicProgress: (topicId: string, progress: number) => void;
  setQuiz: (quiz: Quiz | null) => void;
  setFlashcards: (flashcards: FlashCard[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useLearnStore = create<LearnState>((set) => ({
  messages: [],
  currentTopic: null,
  topics: [
    {
      id: 'react',
      title: 'React',
      description: 'Build user interfaces with React',
      subtopics: ['HTML', 'CSS', 'JavaScript', 'React Basics', 'Components', 'Hooks', 'State Management', 'Projects'],
      progress: 0,
      resources: [
        { title: 'Official Documentation', url: 'https://react.dev', type: 'documentation', platform: 'React', free: true },
        { title: 'FreeCodeCamp React', url: 'https://freecodecamp.org', type: 'tutorial', platform: 'FreeCodeCamp', free: true },
        { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'documentation', platform: 'MDN', free: true },
      ],
    },
    {
      id: 'docker',
      title: 'Docker',
      description: 'Containerize applications with Docker',
      subtopics: ['Containers', 'Images', 'Dockerfile', 'Docker Compose', 'Networking', 'Volumes', 'Swarm'],
      progress: 0,
      resources: [
        { title: 'Docker Docs', url: 'https://docs.docker.com', type: 'documentation', platform: 'Docker', free: true },
        { title: 'Play with Docker', url: 'https://labs.play-with-docker.com', type: 'interactive', platform: 'Docker', free: true },
      ],
    },
    {
      id: 'kubernetes',
      title: 'Kubernetes',
      description: 'Orchestrate containers at scale',
      subtopics: ['Pods', 'Services', 'Deployments', 'ConfigMaps', 'Ingress', 'Storage', 'Helm'],
      progress: 0,
      resources: [
        { title: 'K8s Docs', url: 'https://kubernetes.io/docs', type: 'documentation', platform: 'Kubernetes', free: true },
        { title: 'Play with K8s', url: 'https://labs.play-with-k8s.com', type: 'interactive', platform: 'Kubernetes', free: true },
      ],
    },
    {
      id: 'azure',
      title: 'Azure',
      description: 'Microsoft cloud platform',
      subtopics: ['Cloud Concepts', 'Virtual Machines', 'App Services', 'Azure Functions', 'Storage', 'Networking', 'Security'],
      progress: 0,
      resources: [
        { title: 'Microsoft Learn', url: 'https://learn.microsoft.com/azure', type: 'tutorial', platform: 'Microsoft', free: true },
      ],
    },
    {
      id: 'git',
      title: 'Git',
      description: 'Version control system',
      subtopics: ['Basics', 'Branching', 'Merging', 'Rebasing', 'Remotes', 'Workflows', 'Advanced'],
      progress: 0,
      resources: [
        { title: 'Git SCM', url: 'https://git-scm.com/doc', type: 'documentation', platform: 'Git', free: true },
        { title: 'Learn Git Branching', url: 'https://learngitbranching.js.org', type: 'interactive', platform: 'Community', free: true },
      ],
    },
  ],
  quiz: null,
  flashcards: [],
  isLoading: false,
  error: null,

  addMessage: (role, content) =>
    set((s) => ({
      messages: [...s.messages, { id: generateId(), role, content, timestamp: Date.now() }],
    })),

  setCurrentTopic: (topic) => set({ currentTopic: topic }),

  setTopics: (topics) => set({ topics }),

  updateTopicProgress: (topicId, progress) =>
    set((s) => ({
      topics: s.topics.map((t) => (t.id === topicId ? { ...t, progress } : t)),
    })),

  setQuiz: (quiz) => set({ quiz }),
  setFlashcards: (flashcards) => set({ flashcards }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearChat: () => set({ messages: [], quiz: null, flashcards: [] }),
}));

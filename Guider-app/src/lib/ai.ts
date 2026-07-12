import { api } from './api';

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'gemini-pro', name: 'Gemini Pro' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat' },
] as const;

type ModelId = (typeof AI_MODELS)[number]['id'];

let activeModel: ModelId = 'gpt-4';

export function getActiveModel(): ModelId {
  return activeModel;
}

export function setActiveModel(model: ModelId): void {
  activeModel = model;
  localStorage.setItem('wg-model', model);
}

export function loadModelPreference(): void {
  const saved = localStorage.getItem('wg-model') as ModelId | null;
  if (saved && AI_MODELS.some((m) => m.id === saved)) {
    activeModel = saved;
  }
}

export function getAvailableModels() {
  return AI_MODELS;
}

export async function askAI(query: string, history: string[] = []): Promise<string> {
  try {
    const response = await api.learn.ask(query, history);
    let result = response.content;
    if (response.resources && Array.isArray(response.resources) && response.resources.length > 0) {
      result += '\n\n### 📚 Recommended Resources\n';
      response.resources.forEach((r: any) => {
        result += `• [${r.title}](${r.url}) — ${r.platform} (${r.type})\n`;
      });
    }
    return result;
  } catch {
    return fallbackResponse(query);
  }
}

const topicKnowledge: Record<string, { explain: string; features: string; details: string; resources: string }> = {
  'ai|artificial intelligence|machine learning|ml|deep learning|neural network': {
    explain: 'Artificial Intelligence (AI) is the simulation of human intelligence by machines. It enables computers to learn from data, recognize patterns, make decisions, and understand natural language.',
    features: 'Machine Learning, Natural Language Processing, Computer Vision, Reinforcement Learning, Generative AI',
    details: 'AI systems are trained on large datasets using algorithms like neural networks. Common frameworks include TensorFlow, PyTorch, and scikit-learn.',
    resources: '• [Google AI](https://ai.google) • [Fast.ai](https://www.fast.ai) • [DeepLearning.AI](https://www.deeplearning.ai) • [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)',
  },
  'react|reactjs|react.js': {
    explain: 'React is a JavaScript library for building user interfaces, developed by Meta. It lets you create reusable UI components and efficiently update the DOM using a virtual DOM.',
    features: 'Component Architecture, Virtual DOM, Hooks, JSX, Server-Side Rendering (Next.js), React Native for mobile',
    details: 'React uses a declarative approach — you describe what the UI should look like, and React handles the updates. Key concepts: components, state, props, effects, context, and custom hooks.',
    resources: '• [React Docs](https://react.dev) • [Next.js Docs](https://nextjs.org/docs) • [Scrimba React](https://scrimba.com/learn/learnreact) • [FreeCodeCamp React](https://www.freecodecamp.org/learn/front-end-development-libraries/react/)',
  },
  'docker|container|containerization': {
    explain: 'Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers. Containers package code with all its dependencies so the app runs consistently anywhere.',
    features: 'Container Images, Dockerfile, Docker Compose, Docker Hub, Volumes, Networking, Multi-stage Builds',
    details: 'A Docker container includes everything needed to run an app: code, runtime, system tools, libraries. Images are built from Dockerfiles, shared via registries like Docker Hub.',
    resources: '• [Docker Docs](https://docs.docker.com) • [Play with Docker](https://labs.play-with-docker.com) • [Docker Curriculum](https://docker-curriculum.com)',
  },
  'kubernetes|k8s': {
    explain: 'Kubernetes (K8s) is an open-source platform for automating deployment, scaling, and management of containerized applications across a cluster of machines.',
    features: 'Pods, Services, Deployments, ConfigMaps, Secrets, Ingress, Horizontal Scaling, Self-healing, Service Discovery',
    details: 'Kubernetes orchestrates containers across multiple machines. It handles load balancing, rolling updates, storage orchestration, and secret management.',
    resources: '• [K8s Docs](https://kubernetes.io/docs) • [Play with K8s](https://labs.play-with-k8s.com) • [Kubernetes by Example](https://www.kubernetesbyexample.com)',
  },
  'git|github|version control': {
    explain: 'Git is a distributed version control system that tracks changes in source code. It enables multiple developers to work on the same project simultaneously without conflicts.',
    features: 'Branching & Merging, Distributed Architecture, Staging Area, Commit History, Tagging, Rebasing, Stashing',
    details: 'Git tracks every change as a commit. Branches let you work on features in isolation. GitHub provides remote hosting with PRs, CI/CD, and collaboration features.',
    resources: '• [Git SCM](https://git-scm.com/doc) • [Learn Git Branching](https://learngitbranching.js.org) • [GitHub Skills](https://skills.github.com)',
  },
  'python': {
    explain: 'Python is a high-level, interpreted programming language known for its readability and versatility. It is widely used in web development, data science, AI/ML, automation, and scripting.',
    features: 'Easy-to-read syntax, extensive standard library, dynamic typing, large ecosystem (NumPy, Pandas, Django, Flask), cross-platform',
    details: 'Python emphasizes code readability with significant indentation. It supports multiple paradigms: procedural, object-oriented, and functional.',
    resources: '• [Python Docs](https://docs.python.org/3/) • [Real Python](https://realpython.com) • [FreeCodeCamp Python](https://www.freecodecamp.org/learn/scientific-computing-with-python/)',
  },
  'javascript|js|node|nodejs': {
    explain: 'JavaScript is the core language of the web, running in browsers and on servers (Node.js). It enables interactive web pages and full-stack applications.',
    features: 'First-class functions, prototypal inheritance, event-driven, asynchronous (Promises, async/await), vast npm ecosystem',
    details: 'Modern JS (ES6+) includes classes, arrow functions, template literals, destructuring, modules. Node.js enables server-side JavaScript.',
    resources: '• [MDN JS Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) • [JavaScript.info](https://javascript.info) • [Node.js Docs](https://nodejs.org/docs)',
  },
  'typescript|ts': {
    explain: 'TypeScript is a typed superset of JavaScript that adds static typing, interfaces, generics, and other features to catch errors at compile time.',
    features: 'Static typing, Interfaces, Generics, Enums, Decorators, Type inference, Strict null checks, Excellent IDE support',
    details: 'TypeScript helps catch bugs during development rather than at runtime. It is developed by Microsoft and compiles to any version of JavaScript.',
    resources: '• [TypeScript Docs](https://www.typescriptlang.org/docs) • [TypeScript Playground](https://www.typescriptlang.org/play) • [Total TypeScript](https://www.totaltypescript.com)',
  },
  'azure|microsoft azure|cloud': {
    explain: 'Microsoft Azure is a cloud computing platform offering services like virtual machines, databases, AI, and analytics for building, deploying, and managing applications globally.',
    features: 'Virtual Machines, App Services, Azure Functions (serverless), Azure DevOps, AI/Cognitive Services, Cosmos DB, Blob Storage',
    details: 'Azure supports IaaS, PaaS, and SaaS models. Key concepts: resource groups, regions, availability zones, Azure Active Directory.',
    resources: '• [Microsoft Learn - Azure](https://learn.microsoft.com/azure) • [Azure Free Account](https://azure.microsoft.com/free) • [AZ-900 Study Guide](https://learn.microsoft.com/en-us/certifications/exams/az-900/)',
  },
  'sql|database|postgresql|mysql|mongodb': {
    explain: 'Databases store and manage data. SQL databases (PostgreSQL, MySQL) use relational tables. NoSQL databases (MongoDB) use flexible document models.',
    features: 'SQL: ACID compliance, JOINs, indexes, transactions. NoSQL: flexible schemas, horizontal scaling, document/key-value models',
    details: 'PostgreSQL is the most advanced open-source relational database. MongoDB stores JSON-like documents. Choose based on your data structure needs.',
    resources: '• [PostgreSQL Docs](https://www.postgresql.org/docs) • [MongoDB Docs](https://www.mongodb.com/docs) • [SQL Tutorial](https://www.sqltutorial.org)',
  },
};

function fallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  for (const [pattern, topic] of Object.entries(topicKnowledge)) {
    const regex = new RegExp('\\b(' + pattern.split('|').join('|') + ')\\b', 'i');
    if (regex.test(q)) {
      return `## ${query}\n\n**${topic.explain}**\n\n### Key Features\n${topic.features}\n\n### Details\n${topic.details}\n\n### Free Resources\n${topic.resources}\n\n> Want to go deeper? Ask me about specific subtopics, request code examples, or take a quiz!`;
    }
  }

  return `## ${query}\n\nGood question! Here's a structured approach to learning this topic:\n\n### 1. Start with the Fundamentals\nUnderstand the core concepts and terminology before diving deep.\n\n### 2. Hands-On Practice\nThe best way to learn is by building. Start with small projects.\n\n### 3. Use Free Resources\n• **Official Documentation** – Always the most reliable source\n• **FreeCodeCamp** – Interactive tutorials for most topics\n• **YouTube** – Free video courses from creators like freeCodeCamp, Traversy Media, Fireship\n• **GitHub** – Study open-source projects for real-world examples\n\n### 4. Test Your Knowledge\nTry explaining the concept to someone else, write a blog post, or take online quizzes.\n\n---\nWould you like me to provide specific code examples, recommend a learning path, or generate practice questions?`;
}

export const models = AI_MODELS;

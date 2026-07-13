import OpenAI from 'openai';
import { config } from '../config.js';
import type { AskResponse, QuizQuestion, ResourceResult, PageContext, ExploreStep } from '../types/index.js';
import type { FastifyBaseLogger } from 'fastify';

const openai = new OpenAI({
  baseURL: config.ai.baseUrl,
  apiKey: config.ai.apiKey,
});

const noopLogger: FastifyBaseLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
  trace: () => {},
  debug: () => {},
  child: () => noopLogger,
  level: 'silent',
} as unknown as FastifyBaseLogger;

const SYSTEM_PROMPT = `You are Web-Guider, an AI tutor that helps users learn technology concepts. 

Your responses should be:
- Clear and educational, breaking down complex topics
- Include analogies when helpful
- Provide code examples when relevant
- Suggest free learning resources
- Adapt to the user's experience level

When asked, you can:
1. Explain concepts in detail
2. Provide step-by-step learning paths
3. Generate quiz questions
4. Suggest free resources (documentation, tutorials, videos)
5. Give code examples with explanations

Structure your responses with markdown formatting for readability.`;

export async function askQuestion(
  query: string,
  history: string[] = [],
  model?: string,
  log: FastifyBaseLogger = noopLogger
): Promise<AskResponse> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((msg) => ({ role: 'user' as const, content: msg })),
    { role: 'user', content: query },
  ];

  try {
    log.info({ model: model || config.ai.defaultModel, queryLength: query.length }, 'Calling AI API');
    const completion = await openai.chat.completions.create({
      model: model || config.ai.defaultModel,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || 'I could not process that question. Please try again.';
    log.info({ responseLength: content.length, model: model || config.ai.defaultModel }, 'AI API response received');

    const response: AskResponse = { content };

    if (query.toLowerCase().includes('quiz') || query.toLowerCase().includes('test')) {
      response.quiz = generateMockQuiz(query);
    }

    response.resources = getRelevantResources(query);

    return response;
  } catch (error) {
    log.error(
      { err: error, query, model: model || config.ai.defaultModel },
      'AI API call failed, using fallback response'
    );
    return {
      content: generateFallbackResponse(query),
      resources: getRelevantResources(query),
    };
  }
}

export interface ExploreStepsResult {
  steps: ExploreStep[];
  summary: string;
}

export async function generateExploreSteps(
  goal: string,
  url: string,
  pageContext?: PageContext,
  log: FastifyBaseLogger = noopLogger
): Promise<ExploreStepsResult> {
  const pageDescription = pageContext ? buildPageDescription(pageContext) : 'No page context available.';

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a web navigation guide. Analyze this webpage and generate step-by-step instructions for the user to accomplish their goal.

RULES:
- First check if the goal is ALREADY accomplished (success messages on page, confirmation shown, form submitted, item in cart, etc.). If done, respond: {"completed":true,"summary":"Explain why it's done","steps":[]}
- Use ONLY elements that exist in the page context below
- Each step needs a CSS selector from the page elements
- Actions: click (buttons/links), input (form fields), wait (for page changes), navigate (to URL), highlight (info)
- For input steps, include the value when possible
- Handle dynamic scenarios: clicking may open a modal (e.g., sign-in prompt on "add to cart")
- Each step must have a "reasoning" field explaining WHY this step is needed and what to expect
- Include an overall "summary" field describing the full plan
- Keep instructions short and actionable
- Respond JSON: {"completed":false,"summary":"Overall plan description","steps":[{"instruction":"...","reasoning":"Why this step is needed","selector":"...","action":"click|input|wait|navigate|highlight","value":"..."}]}`,
    },
    {
      role: 'user',
      content: `Goal: ${goal}
URL: ${url}

Page:
${pageDescription}

Generate steps using ONLY the elements listed above. First determine if the goal is already completed.`,
    },
  ];

  log.info({ goal, url, hasPageContext: !!pageContext }, 'Generating explore steps via AI');
  const completion = await openai.chat.completions.create({
    model: config.ai.exploreModel,
    messages,
    temperature: 0.2,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content?.trim();
  log.info({ contentLength: content?.length, finishReason: completion.choices[0]?.finish_reason }, 'Raw AI response');

  if (content) {
    try {
      const parsed = JSON.parse(content);
      if (parsed.completed) {
        log.info({ summary: parsed.summary }, 'Goal already completed per AI');
        return { steps: [], summary: parsed.summary || 'Goal accomplished' };
      }
      if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        const summary = parsed.summary || parsed.steps[0]?.reasoning || '';
        log.info({ stepCount: parsed.steps.length, summary }, 'Explore steps generated');
        const steps = parsed.steps.map((step: Record<string, string>, i: number) => ({
          id: `step-${i + 1}`,
          instruction: step.instruction,
          reasoning: step.reasoning || '',
          selector: step.selector || 'body',
          action: (step.action as ExploreStep['action']) || 'highlight',
          value: step.value,
          optional: step.optional === 'true',
        }));
        return { steps, summary };
      }
      log.warn({ parsed }, 'AI response did not contain valid steps array');
    } catch (parseErr) {
      log.error({ parseErr, content: content.slice(0, 500) }, 'Failed to parse AI JSON response');
    }
  }

  throw new Error('AI returned no valid steps');
}

export async function exploreChat(
  goal: string,
  url: string,
  question: string,
  steps: ExploreStep[],
  currentStep?: number,
  pageContext?: PageContext,
  log: FastifyBaseLogger = noopLogger
): Promise<string> {
  const stepList = steps.map((s, i) => `${i + 1}. [${s.action}] ${s.instruction}${i === currentStep ? ' ← YOU ARE HERE' : ''}`).join('\n');
  const pageDescription = pageContext ? buildPageDescription(pageContext) : 'No page context.';

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a helpful guide inside a web exploration session. The user is following steps to accomplish a goal on a website. Answer their doubt about the current task concisely and helpfully.

Keep answers short (2-4 sentences). Be practical and specific to their current step and goal. If they ask something unrelated, gently redirect to the current task.`,
    },
    {
      role: 'user',
      content: `Goal: ${goal}
URL: ${url}

Current plan:
${stepList}

Page context:
${pageDescription}

User's doubt: ${question}

Answer concisely (2-4 sentences) about this specific task.`,
    },
  ];

  log.info({ goal, question }, 'Generating explore chat answer');
  const completion = await openai.chat.completions.create({
    model: config.ai.exploreModel,
    messages,
    temperature: 0.3,
    max_tokens: 300,
  });

  return completion.choices[0]?.message?.content?.trim() || 'I could not find an answer. Please try rephrasing your question.';
}

function buildPageDescription(ctx: PageContext): string {
  const parts: string[] = [];
  parts.push(`Page: "${ctx.title}" (${ctx.url})`);
  parts.push(`Domain: ${ctx.domain}`);
  parts.push(`Purpose: ${ctx.pagePurpose || 'Unknown'}`);
  parts.push(`Workflow: ${ctx.activeWorkflow || 'Unknown'}`);

  if (ctx.visibleText) {
    parts.push(`\nPage text: "${ctx.visibleText.slice(0, 1000)}"`);
  }

  if (ctx.buttons.length > 0) {
    parts.push(`\nButtons (${ctx.buttons.length}):`);
    ctx.buttons.filter(b => b.visible).slice(0, 30).forEach(b => {
      parts.push(`  - "${b.text}" → selector: ${b.selector}`);
    });
  }

  if (ctx.inputs.length > 0) {
    parts.push(`\nInputs (${ctx.inputs.length}):`);
    ctx.inputs.filter(i => i.visible).slice(0, 20).forEach(i => {
      parts.push(`  - type=${i.type} name="${i.name}" placeholder="${i.placeholder}" label="${i.label}" selector=${i.selector} required=${i.required}`);
    });
  }

  if (ctx.links.length > 0) {
    parts.push(`\nLinks (${ctx.links.length}):`);
    ctx.links.filter(l => l.visible).slice(0, 20).forEach(l => {
      parts.push(`  - "${l.text}" → ${l.href} selector: ${l.selector}`);
    });
  }

  if (ctx.forms.length > 0) {
    parts.push(`\nForms (${ctx.forms.length}):`);
    ctx.forms.slice(0, 5).forEach(f => {
      parts.push(`  - action="${f.action}" method=${f.method} fields=${f.fields} submit="${f.submitText}" selector=${f.selector}`);
    });
  }

  if (ctx.dialogs.length > 0) {
    parts.push(`\nDialogs/Modals (${ctx.dialogs.length}):`);
    ctx.dialogs.slice(0, 5).forEach(d => {
      parts.push(`  - "${d.text.slice(0, 100)}" selector=${d.selector}`);
    });
  }

  if (ctx.errorMessages.length > 0) {
    parts.push(`\nError messages: ${ctx.errorMessages.join(' | ')}`);
  }
  if (ctx.successMessages.length > 0) {
    parts.push(`\nSuccess messages: ${ctx.successMessages.join(' | ')}`);
  }
  if (ctx.validationMessages.length > 0) {
    parts.push(`\nValidation messages: ${ctx.validationMessages.join(' | ')}`);
  }

  return parts.join('\n');
}

function generateMockQuiz(topic: string): QuizQuestion[] {
  return [
    {
      id: '1',
      question: `What is the primary purpose of ${topic}?`,
      options: [
        'Helping developers build and manage software',
        'Managing database systems',
        'Creating user interfaces',
        'Handling network requests',
      ],
      correctAnswer: 0,
      explanation: `${topic} is designed to help developers build better software more efficiently.`,
    },
    {
      id: '2',
      question: `Which of the following best describes a key feature of ${topic}?`,
      options: [
        'Automated deployment',
        'Core functionality',
        'Data persistence',
        'User authentication',
      ],
      correctAnswer: 1,
      explanation: `The core functionality of ${topic} focuses on its primary use case.`,
    },
  ];
}

function getRelevantResources(query: string): ResourceResult[] {
  const resources: ResourceResult[] = [
    {
      title: 'Official Documentation',
      url: `https://developer.mozilla.org/search?q=${encodeURIComponent(query)}`,
      type: 'documentation',
      platform: 'MDN',
      free: true,
    },
    {
      title: 'FreeCodeCamp Tutorials',
      url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(query)}`,
      type: 'tutorial',
      platform: 'FreeCodeCamp',
      free: true,
    },
    {
      title: 'Microsoft Learn',
      url: `https://learn.microsoft.com/search?terms=${encodeURIComponent(query)}`,
      type: 'tutorial',
      platform: 'Microsoft',
      free: true,
    },
  ];

  return resources;
}

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  const topics: Record<string, { explain: string; features: string; details: string; resources: string }> = {
    'ai|artificial intelligence|machine learning|ml|deep learning|neural network': {
      explain: 'Artificial Intelligence (AI) is the simulation of human intelligence by machines. It enables computers to learn from data, recognize patterns, make decisions, and understand natural language.',
      features: 'Machine Learning, Natural Language Processing, Computer Vision, Reinforcement Learning, Generative AI',
      details: 'AI systems are trained on large datasets using algorithms like neural networks. Common frameworks include TensorFlow, PyTorch, and scikit-learn. AI powers everything from chatbots to self-driving cars.',
      resources: '• [Google AI](https://ai.google) • [Fast.ai](https://www.fast.ai) • [DeepLearning.AI](https://www.deeplearning.ai) • [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)',
    },
    'react|reactjs|react.js|nextjs|next.js': {
      explain: 'React is a JavaScript library for building user interfaces, developed by Meta (Facebook). It lets you create reusable UI components and efficiently update the DOM using a virtual DOM.',
      features: 'Component Architecture, Virtual DOM, Hooks, JSX, Server-Side Rendering (Next.js), React Native for mobile',
      details: 'React uses a declarative approach — you describe what the UI should look like, and React handles the updates. Key concepts: components, state, props, effects, context, and custom hooks.',
      resources: '• [React Docs](https://react.dev) • [Next.js Docs](https://nextjs.org/docs) • [Scrimba React](https://scrimba.com/learn/learnreact) • [FreeCodeCamp React](https://www.freecodecamp.org/learn/front-end-development-libraries/react/)',
    },
    'docker|container|containerization': {
      explain: 'Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers. Containers package code with all its dependencies so the app runs consistently anywhere.',
      features: 'Container Images, Dockerfile, Docker Compose, Docker Hub, Volumes, Networking, Multi-stage Builds',
      details: 'A Docker container includes everything needed to run an app: code, runtime, system tools, libraries. Images are built from Dockerfiles, shared via registries like Docker Hub, and orchestrated with Docker Compose or Kubernetes.',
      resources: '• [Docker Docs](https://docs.docker.com) • [Play with Docker](https://labs.play-with-docker.com) • [Docker Curriculum](https://docker-curriculum.com) • [FreeCodeCamp Docker](https://www.freecodecamp.org/news/the-docker-handbook/)',
    },
    'kubernetes|k8s|kube': {
      explain: 'Kubernetes (K8s) is an open-source platform for automating deployment, scaling, and management of containerized applications. It groups containers into pods and manages them across a cluster.',
      features: 'Pods, Services, Deployments, ConfigMaps, Secrets, Ingress, Horizontal Scaling, Self-healing, Service Discovery',
      details: 'Kubernetes orchestrates containers across multiple machines. It handles load balancing, rolling updates, storage orchestration, and secret management. Minikube and kind are popular for local development.',
      resources: '• [K8s Docs](https://kubernetes.io/docs) • [Play with K8s](https://labs.play-with-k8s.com) • [Kubernetes by Example](https://www.kubernetesbyexample.com) • [Kube Academy](https://kube.academy)',
    },
    'git|github|version control|vcs': {
      explain: 'Git is a distributed version control system that tracks changes in source code. It enables multiple developers to work on the same project simultaneously without conflicts.',
      features: 'Branching & Merging, Distributed Architecture, Staging Area, Commit History, Tagging, Rebasing, Stashing',
      details: 'Git tracks every change as a commit. Branches let you work on features in isolation. GitHub/GitLab/GitBitbucket provide remote hosting with PRs, CI/CD, and collaboration features.',
      resources: '• [Git SCM](https://git-scm.com/doc) • [Learn Git Branching](https://learngitbranching.js.org) • [GitHub Skills](https://skills.github.com) • [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)',
    },
    'python|django|flask|fastapi': {
      explain: 'Python is a high-level, interpreted programming language known for its readability and versatility. It is widely used in web development, data science, AI/ML, automation, and scripting.',
      features: 'Easy-to-read syntax, extensive standard library, dynamic typing, large ecosystem (NumPy, Pandas, Django, Flask), cross-platform',
      details: 'Python emphasizes code readability with significant indentation. It supports multiple paradigms: procedural, object-oriented, and functional. The Python Package Index (PyPI) hosts over 400,000 packages.',
      resources: '• [Python Docs](https://docs.python.org/3/) • [Real Python](https://realpython.com) • [FreeCodeCamp Python](https://www.freecodecamp.org/learn/scientific-computing-with-python/) • [Automate the Boring Stuff](https://automatetheboringstuff.com)',
    },
    'javascript|js|ecmascript|es6|node|nodejs': {
      explain: 'JavaScript is a high-level, dynamic programming language that runs in browsers and on servers (Node.js). It is the core language of the web alongside HTML and CSS.',
      features: 'First-class functions, prototypal inheritance, event-driven, asynchronous (Promises, async/await), vast ecosystem (npm)',
      details: 'Modern JS (ES6+) includes classes, arrow functions, template literals, destructuring, modules. Node.js enables server-side JS. npm is the largest package registry with millions of packages.',
      resources: '• [MDN JS Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) • [JavaScript.info](https://javascript.info) • [Node.js Docs](https://nodejs.org/docs) • [FreeCodeCamp JS](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)',
    },
    'typescript|ts': {
      explain: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static typing, interfaces, generics, and other features to catch errors at compile time.',
      features: 'Static typing, Interfaces, Generics, Enums, Decorators, Type inference, Strict null checks, IDE support',
      details: 'TypeScript helps catch bugs during development rather than at runtime. It is developed by Microsoft and is widely used in large-scale applications. It compiles to any version of JavaScript.',
      resources: '• [TypeScript Docs](https://www.typescriptlang.org/docs) • [TypeScript Playground](https://www.typescriptlang.org/play) • [Total TypeScript](https://www.totaltypescript.com) • [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)',
    },
    'html|css|web development|frontend|front-end': {
      explain: 'HTML (HyperText Markup Language) structures web content, while CSS (Cascading Style Sheets) controls the presentation and layout. Together they form the foundation of every website.',
      features: 'HTML: Semantic elements, forms, multimedia, accessibility. CSS: Flexbox, Grid, animations, responsive design, variables',
      details: 'HTML5 introduced semantic tags like `<header>`, `<main>`, `<article>`. Modern CSS includes Grid, Flexbox, Custom Properties (variables), and Container Queries for responsive design.',
      resources: '• [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) • [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) • [FreeCodeCamp HTML/CSS](https://www.freecodecamp.org/learn/responsive-web-design/) • [CSS-Tricks](https://css-tricks.com)',
    },
    'azure|microsoft azure|cloud computing|cloud': {
      explain: 'Microsoft Azure is a cloud computing platform offering services like virtual machines, databases, AI, and analytics. It enables businesses to build, deploy, and manage applications globally.',
      features: 'Virtual Machines, App Services, Azure Functions (serverless), Azure DevOps, AI/Cognitive Services, Cosmos DB, Blob Storage',
      details: 'Azure supports IaaS, PaaS, and SaaS models. Key concepts: resource groups, regions, availability zones, Azure Active Directory. The Azure Portal provides a web-based management interface.',
      resources: '• [Microsoft Learn - Azure](https://learn.microsoft.com/azure) • [Azure Free Account](https://azure.microsoft.com/free) • [Azure Architecture Center](https://docs.microsoft.com/azure/architecture) • [AZ-900 Study Guide](https://learn.microsoft.com/en-us/certifications/exams/az-900/)',
    },
    'aws|amazon web services': {
      explain: 'Amazon Web Services (AWS) is the worlds most comprehensive cloud platform, offering over 200 services including compute, storage, databases, machine learning, and analytics.',
      features: 'EC2 (compute), S3 (storage), Lambda (serverless), RDS (databases), SageMaker (ML), CloudFront (CDN), DynamoDB (NoSQL)',
      details: 'AWS uses a pay-as-you-go pricing model. Key concepts: VPC, IAM, Auto Scaling, Load Balancers. AWS has the largest market share among cloud providers.',
      resources: '• [AWS Docs](https://docs.aws.amazon.com) • [AWS Free Tier](https://aws.amazon.com/free) • [AWS Skill Builder](https://explore.skillbuilder.aws) • [A Cloud Guru](https://www.pluralsight.com/cloud-guru)',
    },
    'sql|database|postgresql|mysql|mongodb|nosql': {
      explain: 'Databases store and manage structured data. SQL databases (PostgreSQL, MySQL) use relational tables and queries. NoSQL databases (MongoDB) use flexible document models for unstructured data.',
      features: 'SQL: ACID compliance, JOINs, indexes, transactions. NoSQL: flexible schemas, horizontal scaling, document/key-value/graph models',
      details: 'PostgreSQL is the most advanced open-source relational database. MongoDB stores JSON-like documents. Choose SQL for structured, relational data; NoSQL for flexible, scalable storage.',
      resources: '• [PostgreSQL Docs](https://www.postgresql.org/docs) • [MongoDB Docs](https://www.mongodb.com/docs) • [SQL Tutorial](https://www.sqltutorial.org) • [FreeCodeCamp SQL](https://www.freecodecamp.org/learn/relational-database/)',
    },
    'api|rest api|graphql|api design': {
      explain: 'An API (Application Programming Interface) allows different software systems to communicate. REST uses HTTP methods (GET, POST, PUT, DELETE) while GraphQL lets clients request exactly the data they need.',
      features: 'REST: Stateless, resource-based, uses JSON/XML. GraphQL: Single endpoint, typed schema, real-time subscriptions',
      details: 'Good API design follows RESTful principles: use proper HTTP methods, meaningful status codes, versioning, pagination, authentication (JWT, OAuth). Tools: Swagger/OpenAPI, Postman.',
      resources: '• [REST API Tutorial](https://restfulapi.net) • [GraphQL Docs](https://graphql.org/learn) • [MDN HTTP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP) • [Postman Learning Center](https://learning.postman.com)',
    },
  };

  for (const [pattern, topic] of Object.entries(topics)) {
    const regex = new RegExp(pattern.split('|').map(p => `\\b${p}\\b`).join('|'), 'i');
    if (regex.test(q)) {
      return `## ${query}\n\n**${topic.explain}**\n\n### Key Features\n${topic.features}\n\n### Details\n${topic.details}\n\n### Free Resources\n${topic.resources}\n\n> Want to go deeper? Ask me about specific subtopics, request code examples, or take a quiz!`;
    }
  }

  return `## ${query}\n\nGood question! Here's a structured approach to learning this topic:\n\n### 1. Start with the Fundamentals\nUnderstand the core concepts and terminology before diving deep.\n\n### 2. Hands-On Practice\nThe best way to learn is by building. Start with small projects.\n\n### 3. Use Free Resources\n• **Official Documentation** – Always the most reliable source\n• **FreeCodeCamp** – Interactive tutorials for most topics\n• **YouTube** – Free video courses (freeCodeCamp, Traversy Media, Fireship)\n• **GitHub** – Study open-source projects for real-world examples\n\n### 4. Test Your Knowledge\nTry explaining the concept to someone else, write a blog post, or take online quizzes.\n\n---\nWould you like me to provide specific code examples, recommend a learning path, or generate practice questions?`;
}

function generateFallbackSteps(goal: string): import('../types/index.js').ExploreStep[] {
  const id = (i: number) => `step-${i}`;
  return [
    { id: id(1), instruction: `Navigate to the website to ${goal}`, selector: 'body', action: 'navigate' },
    { id: id(2), instruction: 'Find and click the main action button', selector: 'button:first-of-type', action: 'click' },
    { id: id(3), instruction: 'Fill in the required information', selector: 'input:first-of-type', action: 'input', value: 'Your input here' },
    { id: id(4), instruction: 'Submit the form to complete', selector: '[type="submit"]', action: 'click' },
  ];
}

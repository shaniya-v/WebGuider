import OpenAI from 'openai';
import { config } from '../config.js';
import type { AskResponse, QuizQuestion, ResourceResult } from '../types/index.js';

const openai = new OpenAI({
  baseURL: config.openrouter.baseUrl,
  apiKey: config.openrouter.apiKey,
});

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
  model?: string
): Promise<AskResponse> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((msg) => ({ role: 'user' as const, content: msg })),
    { role: 'user', content: query },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: model || config.ai.defaultModel,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || 'I could not process that question. Please try again.';

    const response: AskResponse = { content };

    if (query.toLowerCase().includes('quiz') || query.toLowerCase().includes('test')) {
      response.quiz = generateMockQuiz(query);
    }

    response.resources = getRelevantResources(query);

    return response;
  } catch (error) {
    console.error('[AI Service] Error:', error);
    return {
      content: generateFallbackResponse(query),
      resources: getRelevantResources(query),
    };
  }
}

export async function generateExploreSteps(
  goal: string,
  url: string
): Promise<import('../types/index.js').ExploreStep[]> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a web navigation guide. Given a user's goal and a website URL, generate step-by-step instructions for the user to accomplish their goal.

For each step, provide:
1. A clear, concise instruction
2. A CSS selector for the element (can be approximate)
3. The action type: click, input, wait, navigate, or highlight
4. Optional: a value to input

Respond with a JSON array of steps.`,
    },
    {
      role: 'user',
      content: `Goal: ${goal}\nWebsite: ${url}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: config.ai.defaultModel,
      messages,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      if (parsed.steps && Array.isArray(parsed.steps)) {
        return parsed.steps.map((step: Record<string, string>, i: number) => ({
          id: `step-${i + 1}`,
          instruction: step.instruction,
          selector: step.selector || 'body',
          action: (step.action as import('../types/index.js').ExploreStep['action']) || 'highlight',
          value: step.value,
          optional: step.optional === 'true',
        }));
      }
    }
  } catch (error) {
    console.error('[AI Service] Error generating steps:', error);
  }

  return generateFallbackSteps(goal);
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
  return `**${query}**\n\nHere's what I can tell you about this topic:\n\n1. **Core Concept** – This is a fundamental technology in modern software development\n2. **Key Features** – It provides essential functionality for developers\n3. **Best Practices** – Follow official documentation and community guidelines\n\nWould you like me to:\n• Provide more detailed explanations\n• Share code examples\n• Generate practice questions\n• Suggest learning resources`;
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

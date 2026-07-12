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
    return response.content;
  } catch {
    return fallbackResponse(query);
  }
}

function fallbackResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('what') || lower.includes('explain') || lower.includes('what is')) {
    return `**${query}**\n\n${query} is a technology/concept in software development. Here's what you should know:\n\n1. **Core Concept** – It helps developers build better software\n2. **Key Features** – Check the official documentation for specifics\n3. **Best Practices** – Follow community guidelines\n\nWould you like me to provide examples, a quiz, or suggest learning resources?`;
  }
  if (lower.includes('how to') || lower.includes('learn')) {
    return `Here's a learning path for "${query}":\n\n1. **Start with basics** – Understand core concepts first\n2. **Practice with examples** – Build small projects\n3. **Advanced topics** – Dive into complex patterns\n4. **Real-world projects** – Apply your knowledge\n\nI can provide specific resources, code examples, or quizzes. What would you like?`;
  }
  return `Great question about "${query}"!\n\nLet me break this down:\n\n• Start with the fundamentals\n• Practice regularly with hands-on examples\n• refer to official documentation for detailed information\n• Join community discussions for practical insights\n\nWould you like me to go deeper, provide examples, or suggest free resources?`;
}

export const models = AI_MODELS;

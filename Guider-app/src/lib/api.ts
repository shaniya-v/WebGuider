const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  return res.json();
}

export const api = {
  learn: {
    ask: (query: string, history: string[]) =>
      request<{ content: string; resources?: unknown[]; quiz?: unknown[] }>('/learn/ask', {
        method: 'POST',
        body: JSON.stringify({ query, history }),
      }),
    quiz: (topicId: string) =>
      request<{ questions: unknown[] }>(`/learn/quiz/${topicId}`),
    resources: (topic: string) =>
      request<{ resources: unknown[] }>(`/learn/resources/${encodeURIComponent(topic)}`),
    progress: () =>
      request<{ topics: unknown[] }>('/learn/progress'),
  },

  explore: {
    start: (goal: string, url: string) =>
      request<{ session: unknown }>('/explore/start', {
        method: 'POST',
        body: JSON.stringify({ goal, url }),
      }),
    step: (sessionId: string, action: string, data?: unknown) =>
      request<{ nextStep: unknown; completed: boolean }>(`/explore/step/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify({ action, data }),
      }),
    analyze: (url: string) =>
      request<{ analysis: unknown }>('/explore/analyze', {
        method: 'POST',
        body: JSON.stringify({ url }),
      }),
    analyzeAI: (goal: string, url: string, pageContext: unknown) =>
      request<{ steps: unknown[]; completed: boolean }>('/explore/analyze-ai', {
        method: 'POST',
        body: JSON.stringify({ goal, url, pageContext }),
      }),
  },

  resources: {
    search: (query: string) =>
      request<{ results: unknown[] }>(`/resources/search/${encodeURIComponent(query)}`),
  },

  auth: {
    profile: () => request<{ profile: unknown }>('/auth/profile'),
    updatePreferences: (prefs: unknown) =>
      request<{ success: boolean }>('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs),
      }),
  },
};

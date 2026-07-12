import type { ResourceResult } from '../types/index.js';

const RESOURCE_SOURCES = [
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    type: 'documentation' as const,
    searchUrl: (q: string) => `https://developer.mozilla.org/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org',
    type: 'tutorial' as const,
    searchUrl: (q: string) => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Microsoft Learn',
    url: 'https://learn.microsoft.com',
    type: 'tutorial' as const,
    searchUrl: (q: string) => `https://learn.microsoft.com/search?terms=${encodeURIComponent(q)}`,
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    type: 'article' as const,
    searchUrl: (q: string) => `https://github.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    type: 'video' as const,
    searchUrl: (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  },
];

export async function searchResources(query: string, limit = 5): Promise<ResourceResult[]> {
  const results: ResourceResult[] = RESOURCE_SOURCES.map((source) => ({
    title: `Learn ${query} on ${source.name}`,
    url: source.searchUrl(query),
    type: source.type,
    platform: source.name,
    free: true,
  }));

  return results.slice(0, limit);
}

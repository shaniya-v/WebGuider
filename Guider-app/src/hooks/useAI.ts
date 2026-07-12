import { useState, useCallback } from 'react';
import { askAI } from '../lib/ai';
import { useLearnStore } from '../stores/learnStore';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMessage } = useLearnStore();

  const sendMessage = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    addMessage('user', query);
    try {
      const response = await askAI(query);
      addMessage('assistant', response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get response';
      setError(message);
      addMessage('assistant', `Error: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  return { sendMessage, loading, error };
}

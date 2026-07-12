import { useState, useCallback } from 'react';
import type { DomAnalysisResult } from '../lib/dom';

export function useDomAnalysis() {
  const [analysis, setAnalysis] = useState<DomAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCurrentPage = useCallback(async () => {
    setLoading(true);
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (!tab?.id) throw new Error('No active tab');

      const response = await browser.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' });
      setAnalysis(response as DomAnalysisResult);
      return response as DomAnalysisResult;
    } catch (err) {
      console.error('DOM analysis failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analysis, loading, analyzeCurrentPage };
}

import { FastifyInstance } from 'fastify';
import { askQuestion } from '../services/ai.js';
import { searchResources } from '../services/search.js';

interface AskBody {
  query: string;
  history?: string[];
  model?: string;
}

export async function learnRoutes(app: FastifyInstance) {
  app.post('/api/learn/ask', async (request, reply) => {
    const { query, history, model } = request.body as AskBody;

    if (!query || typeof query !== 'string') {
      return reply.status(400).send({ error: 'Query is required' });
    }

    try {
      const response = await askQuestion(query, history, model);
      return reply.send(response);
    } catch (error) {
      console.error('[Learn Route] Error:', error);
      return reply.status(500).send({ error: 'Failed to process question' });
    }
  });

  app.get('/api/learn/quiz/:topicId', async (request, reply) => {
    const { topicId } = request.params as { topicId: string };

    const response = await askQuestion(`Generate a quiz about ${topicId}`, []);
    return reply.send({
      topicId,
      questions: response.quiz || [],
    });
  });

  app.get('/api/learn/resources/:topic', async (request, reply) => {
    const { topic } = request.params as { topic: string };

    const resources = await searchResources(topic);
    return reply.send({ resources });
  });

  app.get('/api/learn/progress', async (_request, reply) => {
    // In production, fetch from Supabase
    return reply.send({
      topics: [],
      overall: 0,
    });
  });
}

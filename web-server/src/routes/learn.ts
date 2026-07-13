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
      request.log.warn({ body: request.body }, 'Invalid ask request: missing query');
      return reply.status(400).send({ error: 'Query is required' });
    }

    try {
      request.log.info({ query, model }, 'Processing ask question');
      const response = await askQuestion(query, history, model, request.log);
      return reply.send(response);
    } catch (error) {
      request.log.error(
        { err: error, query, model },
        'Failed to process question'
      );
      return reply.status(500).send({ error: 'Failed to process question' });
    }
  });

  app.get('/api/learn/quiz/:topicId', async (request, reply) => {
    const { topicId } = request.params as { topicId: string };
    request.log.info({ topicId }, 'Generating quiz');

    try {
      const response = await askQuestion(`Generate a quiz about ${topicId}`, [], undefined, request.log);
      return reply.send({
        topicId,
        questions: response.quiz || [],
      });
    } catch (error) {
      request.log.error({ err: error, topicId }, 'Failed to generate quiz');
      return reply.status(500).send({ error: 'Failed to generate quiz' });
    }
  });

  app.get('/api/learn/resources/:topic', async (request, reply) => {
    const { topic } = request.params as { topic: string };
    request.log.info({ topic }, 'Fetching learning resources');

    try {
      const resources = await searchResources(topic);
      return reply.send({ resources });
    } catch (error) {
      request.log.error({ err: error, topic }, 'Failed to search resources');
      return reply.status(500).send({ error: 'Failed to search resources' });
    }
  });

  app.get('/api/learn/progress', async (request, reply) => {
    request.log.info('Fetching learning progress');
    // In production, fetch from Supabase
    return reply.send({
      topics: [],
      overall: 0,
    });
  });
}

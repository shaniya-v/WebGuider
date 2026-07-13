import { FastifyInstance } from 'fastify';
import { searchResources } from '../services/search.js';

export async function resourceRoutes(app: FastifyInstance) {
  app.get('/api/resources/search/:query', async (request, reply) => {
    const { query } = request.params as { query: string };

    if (!query) {
      request.log.warn({ params: request.params }, 'Invalid resource search: missing query');
      return reply.status(400).send({ error: 'Query is required' });
    }

    try {
      request.log.info({ query }, 'Searching resources');
      const results = await searchResources(query);
      return reply.send({ results });
    } catch (error) {
      request.log.error({ err: error, query }, 'Resource search failed');
      return reply.status(500).send({ error: 'Search failed' });
    }
  });
}

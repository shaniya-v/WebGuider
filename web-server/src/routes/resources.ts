import { FastifyInstance } from 'fastify';
import { searchResources } from '../services/search.js';

export async function resourceRoutes(app: FastifyInstance) {
  app.get('/api/resources/search/:query', async (request, reply) => {
    const { query } = request.params as { query: string };

    if (!query) {
      return reply.status(400).send({ error: 'Query is required' });
    }

    try {
      const results = await searchResources(query);
      return reply.send({ results });
    } catch (error) {
      console.error('[Resource Route] Error:', error);
      return reply.status(500).send({ error: 'Search failed' });
    }
  });
}

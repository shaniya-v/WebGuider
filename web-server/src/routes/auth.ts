import { FastifyInstance } from 'fastify';
import type { UserPreferences } from '../types/index.js';

export async function authRoutes(app: FastifyInstance) {
  app.get('/api/auth/profile', async (_request, reply) => {
    // In production, fetch from Supabase
    return reply.send({
      profile: {
        id: 'anonymous',
        preferences: {
          theme: 'system',
          model: 'gpt-4',
          voiceEnabled: false,
          autoProgress: true,
        },
      },
    });
  });

  app.put('/api/auth/preferences', async (request, reply) => {
    const preferences = request.body as Partial<UserPreferences>;

    // In production, save to Supabase
    return reply.send({
      success: true,
      preferences,
    });
  });
}

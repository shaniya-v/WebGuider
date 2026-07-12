import { FastifyInstance } from 'fastify';
import { generateExploreSteps } from '../services/ai.js';
import type { ExploreSession, ExploreStep } from '../types/index.js';

const sessions = new Map<string, ExploreSession>();

export async function exploreRoutes(app: FastifyInstance) {
  app.post('/api/explore/start', async (request, reply) => {
    const { goal, url } = request.body as { goal: string; url: string };

    if (!goal || !url) {
      return reply.status(400).send({ error: 'Goal and URL are required' });
    }

    try {
      const steps = await generateExploreSteps(goal, url);

      const session: ExploreSession = {
        id: `session-${Date.now()}`,
        goal,
        website: url,
        steps,
        currentStep: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      sessions.set(session.id, session);

      return reply.send({ session });
    } catch (error) {
      console.error('[Explore Route] Error:', error);
      return reply.status(500).send({ error: 'Failed to create session' });
    }
  });

  app.post('/api/explore/step/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const { action } = request.body as { action: string };

    const session = sessions.get(sessionId);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    switch (action) {
      case 'next':
        if (session.currentStep < session.steps.length - 1) {
          session.currentStep++;
        } else {
          session.completed = true;
        }
        break;
      case 'prev':
        if (session.currentStep > 0) {
          session.currentStep--;
        }
        break;
      case 'complete':
        session.completed = true;
        break;
      case 'retry':
        session.currentStep = 0;
        session.completed = false;
        break;
    }

    return reply.send({
      nextStep: session.steps[session.currentStep],
      completed: session.completed,
      session,
    });
  });

  app.post('/api/explore/analyze', async (request, reply) => {
    const { url } = request.body as { url: string };

    if (!url) {
      return reply.status(400).send({ error: 'URL is required' });
    }

    // In production, use Puppeteer/Playwright for server-side DOM analysis
    return reply.send({
      analysis: {
        url,
        title: '',
        elements: [],
        analyzedAt: new Date().toISOString(),
      },
    });
  });
}

import { FastifyInstance } from 'fastify';
import { generateExploreSteps, exploreChat, generateSuggestion, type ExploreStepsResult } from '../services/ai.js';
import type { ExploreSession, ExploreStep, PageContext, ExploreChatRequest } from '../types/index.js';

const sessions = new Map<string, ExploreSession>();

export async function exploreRoutes(app: FastifyInstance) {
  app.post('/api/explore/start', async (request, reply) => {
    const { goal, url, pageContext } = request.body as { goal: string; url: string; pageContext?: PageContext };

    if (!goal || !url) {
      request.log.warn({ body: request.body }, 'Invalid explore start: missing goal or url');
      return reply.status(400).send({ error: 'Goal and URL are required' });
    }

    try {
      request.log.info({ goal, url, hasPageContext: !!pageContext }, 'Starting exploration session');
      const result = await generateExploreSteps(goal, url, pageContext, request.log);

      const session: ExploreSession = {
        id: `session-${Date.now()}`,
        goal,
        website: url,
        steps: result.steps,
        currentStep: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      sessions.set(session.id, session);
      request.log.info({ sessionId: session.id, stepCount: result.steps.length }, 'Session created');

      return reply.send({ session });
    } catch (error) {
      request.log.error(
        { err: error, goal, url },
        'Failed to create exploration session'
      );
      return reply.status(500).send({ error: 'Failed to create session' });
    }
  });

  app.post('/api/explore/step/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const { action } = request.body as { action: string };

    const session = sessions.get(sessionId);
    if (!session) {
      request.log.warn({ sessionId }, 'Session not found for step');
      return reply.status(404).send({ error: 'Session not found' });
    }

    request.log.info({ sessionId, action, currentStep: session.currentStep }, 'Processing exploration step');

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
      default:
        request.log.warn({ sessionId, action }, 'Unknown action in exploration step');
        return reply.status(400).send({ error: `Unknown action: ${action}` });
    }

    request.log.info(
      { sessionId, action, newStep: session.currentStep, completed: session.completed },
      'Step processed'
    );

    return reply.send({
      nextStep: session.steps[session.currentStep],
      completed: session.completed,
      session,
    });
  });

  app.post('/api/explore/analyze', async (request, reply) => {
    const { url } = request.body as { url: string };

    if (!url) {
      request.log.warn({ body: request.body }, 'Invalid analyze request: missing url');
      return reply.status(400).send({ error: 'URL is required' });
    }

    request.log.info({ url }, 'Analyzing page (stub)');
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

  app.post('/api/explore/analyze-ai', async (request, reply) => {
    const { goal, url, pageContext } = request.body as { goal: string; url: string; pageContext?: PageContext };

    if (!goal || !url) {
      request.log.warn({ body: request.body }, 'Invalid AI analyze request: missing goal or url');
      return reply.status(400).send({ error: 'Goal and URL are required' });
    }

    try {
      request.log.info({ goal, url, hasPageContext: !!pageContext }, 'AI page analysis requested');
      const result = await generateExploreSteps(goal, url, pageContext, request.log);

      return reply.send({
        steps: result.steps,
        summary: result.summary,
        completed: result.completed,
        url,
        goal,
      });
    } catch (error) {
      request.log.error({ err: error, goal, url }, 'AI page analysis failed');
      return reply.status(500).send({ error: error instanceof Error ? error.message : 'Analysis failed' });
    }
  });

  app.post('/api/explore/chat', async (request, reply) => {
    const { goal, url, pageContext, question, steps, currentStep } = request.body as ExploreChatRequest & { pageContext?: PageContext; steps: ExploreStep[] };

    if (!goal || !question) {
      request.log.warn({ body: request.body }, 'Invalid explore chat request: missing goal or question');
      return reply.status(400).send({ error: 'Goal and question are required' });
    }

    try {
      request.log.info({ goal, questionLength: question.length }, 'Explore chat requested');
      const answer = await exploreChat(goal, url, question, steps || [], currentStep, pageContext, request.log);
      return reply.send({ answer });
    } catch (error) {
      request.log.error({ err: error, goal }, 'Explore chat failed');
      return reply.status(500).send({ error: error instanceof Error ? error.message : 'Chat failed' });
    }
  });

  app.post('/api/explore/suggest', async (request, reply) => {
    const { goal, url, pageContext, recentActivity, currentSteps } = request.body as {
      goal: string; url: string; pageContext?: PageContext;
      recentActivity: Array<{ type: string; target?: string; value?: string }>;
      currentSteps: ExploreStep[];
    };

    try {
      request.log.info({ goal, activityCount: recentActivity?.length }, 'Suggestion requested');
      const suggestion = await generateSuggestion(goal, url, pageContext, recentActivity || [], currentSteps || [], request.log);
      return reply.send({ suggestion });
    } catch (error) {
      request.log.error({ err: error, goal }, 'Suggestion generation failed');
      return reply.status(500).send({ error: error instanceof Error ? error.message : 'Suggestion failed' });
    }
  });
}

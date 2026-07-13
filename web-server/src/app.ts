import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { learnRoutes } from './routes/learn.js';
import { exploreRoutes } from './routes/explore.js';
import { resourceRoutes } from './routes/resources.js';
import { authRoutes } from './routes/auth.js';
import { config } from './config.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    },
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Health check
  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));

  // Routes
  await app.register(learnRoutes);
  await app.register(exploreRoutes);
  await app.register(resourceRoutes);
  await app.register(authRoutes);

  // Centralized error handler for unhandled errors
  app.setErrorHandler((error, request, reply) => {
    request.log.error(
      { err: error, url: request.url, method: request.method, body: request.body },
      'Unhandled error'
    );
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal server error' : error.message,
      statusCode,
    });
  });

  return app;
}

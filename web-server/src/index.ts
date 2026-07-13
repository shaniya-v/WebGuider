import { buildApp } from './app.js';
import { config } from './config.js';

async function main() {
  const app = await buildApp();

  process.on('uncaughtException', (err) => {
    app.log.fatal({ err }, 'Uncaught exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    app.log.fatal({ err: reason }, 'Unhandled promise rejection');
  });

  try {
    await app.listen({
      port: config.port,
      host: config.host,
    });
    app.log.info({ port: config.port, host: config.host }, 'Server started');
  } catch (err) {
    app.log.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

main();

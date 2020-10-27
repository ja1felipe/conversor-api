import { SetupServer } from './server';
import config from 'config';
import logger from './logger';

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exist due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exist due to an unhandled expection: ${error}`);
  process.exit(1);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    for (const sig of exitSignals) {
      process.on(sig, async () => {
        try {
          await server.close();
          logger.info(`App shutdown with success.`);
          process.exit(0);
        } catch (error) {
          logger.error(`App shutdown with failure: ${error}`);
          process.exit(1);
        }
      });
    }
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(1);
  }
})();

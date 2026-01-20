import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import videoRoutes from './routes/videoRoutes';
import { logger } from './utils/logger';
import { redis } from './utils/redis';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: '*' });
await fastify.register(rateLimit, { max: Number(process.env.RATE_LIMIT || 10), timeWindow: '1 minute' });

fastify.get('/', async () => ({ status: 'VideoDownloader API rodando!' }));

await fastify.register(videoRoutes, { prefix: '/api/video' });

const start = async () => {
  try {
    await redis.connect();
    await fastify.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    logger.info('Servidor iniciado!');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};
start();

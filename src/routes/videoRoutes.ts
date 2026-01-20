import { FastifyInstance } from 'fastify';
import { analyze, status } from '../controllers/videoController';

export default async (fastify: FastifyInstance) => {
  fastify.post('/analyze', analyze);
  fastify.post('/download', async (req, reply) => {
    // Implementar download stream futuro
    reply.send({ success: true, message: 'Download iniciado' });
  });
  fastify.get('/status/:id', status);
};

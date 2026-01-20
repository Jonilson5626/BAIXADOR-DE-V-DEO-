import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { analyzeVideo } from '../utils/ytDlp';
import { logger } from '../utils/logger';
import { addToQueue } from '../services/queueService';

const analyzeSchema = z.object({
  url: z.string().url('URL inválida')
});

export async function analyze(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { url } = analyzeSchema.parse(req.body);
    const platform = detectPlatform(url);
    
    // Cache check
    const cached = await redis.get(`analyze:${url}`);
    if (cached) return reply.send(JSON.parse(cached));
    
    const video = await analyzeVideo(url);
    await redis.setex(`analyze:${url}`, 3600, JSON.stringify(video)); // Cache 1h
    
    const jobId = await addToQueue(url);
    return reply.send({ ...video, jobId });
  } catch (error) {
    logger.error(error);
    reply.code(400).send({ success: false, error: 'Link inválido ou plataforma não suportada' });
  }
}

export async function status(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = req.params;
  // Simula status da fila
  reply.send({ jobId: id, status: 'processando', completed: false, progress: 50 });
}

function detectPlatform(url: string) {
  if (url.includes('youtube.com')) return 'YouTube';
  // ... outros
  return 'Desconhecida';
}

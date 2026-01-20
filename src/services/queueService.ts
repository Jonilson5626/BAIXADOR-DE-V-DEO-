import { Queue } from 'bullmq';
import { redis } from '../utils/redis';
import { logger } from '../utils/logger';

const videoQueue = new Queue('video processing', { connection: redis });

export async function addToQueue(url: string) {
  const job = await videoQueue.add('process video', { url });
  return job.id;
}

// Worker (rode separadamente ou em cluster)
videoQueue.process(async (job) => {
  logger.info(`Processando ${job.data.url}`);
  // ytDlp.download(job.data.url, { cwd: './downloads' });
});

import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import { logger } from './logger';

const ytDlpPath = process.env.YT_DLP_PATH || './yt-dlp';
const ffmpegPath = process.env.FFMPEG_PATH || './ffmpeg';

export const ytDlp = new YTDlpWrap(ytDlpPath);
ytDlp.setFfmpegPath(ffmpegPath);

export async function analyzeVideo(url: string) {
  try {
    const info = await ytDlp.getVideoInfo(url);
    const formats = ytDlp.getVideoFormats(info)[0]; // Simula formatos
    const platform = detectPlatform(url);
    
    return {
      success: true,
      video: {
        id: info.id,
        title: info.title || 'Vídeo sem título',
        thumbnail: info.thumbnail?.[0]?.url || '',
        platform,
        duration: info.duration || 0,
        downloads: {
          low: info.url || '', // Simulado
          medium: info.url || '',
          high: info.url || ''
        }
      }
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Falha ao analisar vídeo');
  }
}

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com')) return 'Facebook';
  return 'Desconhecida';
}

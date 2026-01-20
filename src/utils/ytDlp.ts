export async function analyzeVideo(url: string) {
  const platform = detectPlatform(url);
  // Simula resposta (Vercel sem yt-dlp)
  return {
    success: true,
    video: {
      id: 'simulado',
      title: `Vídeo do ${platform}`,
      thumbnail: 'https://via.placeholder.com/320x180/FF6B6B/FFFFFF?text=Vídeo',
      platform,
      duration: 120,
      downloads: {
        low: 'https://example.com/low.mp4',
        medium: 'https://example.com/medium.mp4',
        high: 'https://example.com/high.mp4'
      }
    }
  };
}

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com')) return 'Facebook';
  return 'Desconhecida';
}

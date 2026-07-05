export function parseMediaUrls(urlStr) {
  if (!urlStr) return [];
  try {
    const parsed = JSON.parse(urlStr);
    return Array.isArray(parsed) ? parsed : [urlStr];
  } catch {
    return [urlStr];
  }
}

export function isVideoUrl(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '');
}

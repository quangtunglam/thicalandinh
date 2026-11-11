import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a clean YouTube embed URL from either raw <iframe> HTML embed code
 * or any standard YouTube video URL (watch?v=, youtu.be/, embed/, shorts/, live/).
 */
export function extractYoutubeEmbedUrl(input?: string): string | null {
  if (!input || !input.trim()) return null;
  const raw = input.trim();

  // 1. If user pasted an <iframe> tag, extract the src="..." attribute
  if (raw.includes('<iframe')) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1].trim();
    }
  }

  // 2. If it's already an embed URL
  if (raw.includes('youtube.com/embed/') || raw.includes('youtube-nocookie.com/embed/')) {
    return raw;
  }

  // 3. Extract video ID from watch?v=, youtu.be/, shorts/, live/, v/
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i,
  ];

  for (const regex of patterns) {
    const match = raw.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // 4. If user pasted just the 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return `https://www.youtube.com/embed/${raw}`;
  }

  return null;
}

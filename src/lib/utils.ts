import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a clean video embed URL from either raw <iframe> HTML embed code,
 * YouTube URLs (watch?v=, youtu.be/, embed/, shorts/, live/), or
 * Gan Jing World URLs (ganjingworld.com/video/..., /vi-VN/video/..., /embed/..., /shorts/...).
 */
export function extractYoutubeEmbedUrl(input?: string): string | null {
  if (!input || !input.trim()) return null;
  let raw = input.trim();

  // 1. If user pasted an <iframe> tag, extract the src="..." attribute first
  if (raw.includes('<iframe')) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      raw = srcMatch[1].trim();
    }
  }

  // 2. Gan Jing World support (ganjingworld.com)
  if (/ganjingworld\.com/i.test(raw)) {
    const gjwMatch = raw.match(
      /ganjingworld\.com\/(?:[a-z]{2}(?:-[a-zA-Z]{2,4})?\/)?(?:video|shorts|embed|s|live)\/([a-zA-Z0-9_-]+)/i
    );
    if (gjwMatch && gjwMatch[1]) {
      return `https://www.ganjingworld.com/embed/${gjwMatch[1]}`;
    }
    if (raw.includes('ganjingworld.com/embed/')) {
      return raw;
    }
  }

  // 3. If it's already a YouTube embed URL
  if (raw.includes('youtube.com/embed/') || raw.includes('youtube-nocookie.com/embed/')) {
    return raw;
  }

  // 4. Extract YouTube video ID from watch?v=, youtu.be/, shorts/, live/, v/
  const ytPatterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/i,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i,
  ];

  for (const regex of ytPatterns) {
    const match = raw.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // 5. If user pasted another valid https:// embed URL inside <iframe>
  if (/^https?:\/\/[^\s"'<>]+$/i.test(raw) && raw.includes('/embed/')) {
    return raw;
  }

  // 6. If user pasted just the 11-char YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return `https://www.youtube.com/embed/${raw}`;
  }

  return null;
}

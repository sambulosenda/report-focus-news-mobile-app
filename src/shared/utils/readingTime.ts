import { stripHtml } from './html';

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string | null | undefined): number {
  if (!content) return 1;
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export function getReadingTimeDisplay(content: string | null | undefined): string {
  return formatReadingTime(calculateReadingTime(content));
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&hellip;': '\u2026',
  '&mdash;': '\u2014',
  '&ndash;': '\u2013',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
};

/**
 * Strips HTML tags and decodes common HTML entities
 */
export function stripHtml(html: string | undefined | null): string {
  if (!html) return '';

  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, entity => HTML_ENTITIES[entity] || entity) // Decode entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

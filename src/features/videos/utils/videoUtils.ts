import type { VideoInfo } from '../types';

// WordPress hosted video detection
const DIRECT_VIDEO_REGEX = /(https?:\/\/[^\s"'<>]+\.(?:mp4|webm|mov|m4v))/i;
const VIDEO_TAG_REGEX = /<video[^>]*src=["']([^"']+)["']/i;
const SOURCE_TAG_REGEX = /<source[^>]*src=["']([^"']+)["'][^>]*type=["']video/i;
// WordPress video block
const WP_VIDEO_BLOCK_REGEX = /wp:video[^}]*"id":\s*(\d+)/i;
const WP_VIDEO_SRC_REGEX = /wp-video[^>]*src=["']([^"']+)["']/i;

export function isVideoPost(content: string | undefined): boolean {
  if (!content) return false;
  return (
    DIRECT_VIDEO_REGEX.test(content) ||
    VIDEO_TAG_REGEX.test(content) ||
    SOURCE_TAG_REGEX.test(content) ||
    WP_VIDEO_BLOCK_REGEX.test(content) ||
    WP_VIDEO_SRC_REGEX.test(content)
  );
}

export function extractVideoInfo(content: string | undefined): VideoInfo | null {
  if (!content) return null;

  // Check for <video> or <source> tags
  const videoTagMatch = content.match(VIDEO_TAG_REGEX);
  if (videoTagMatch) {
    return {
      type: 'direct',
      id: videoTagMatch[1],
      url: videoTagMatch[1],
      thumbnail: undefined,
    };
  }

  const sourceTagMatch = content.match(SOURCE_TAG_REGEX);
  if (sourceTagMatch) {
    return {
      type: 'direct',
      id: sourceTagMatch[1],
      url: sourceTagMatch[1],
      thumbnail: undefined,
    };
  }

  // Check for WordPress video block (wp-video class)
  const wpVideoMatch = content.match(WP_VIDEO_SRC_REGEX);
  if (wpVideoMatch) {
    return {
      type: 'direct',
      id: wpVideoMatch[1],
      url: wpVideoMatch[1],
      thumbnail: undefined,
    };
  }

  // Check for WordPress video block by ID and extract URL from content
  if (WP_VIDEO_BLOCK_REGEX.test(content)) {
    // Try to find video URL within the block content
    const directInBlock = content.match(DIRECT_VIDEO_REGEX);
    if (directInBlock) {
      return {
        type: 'direct',
        id: directInBlock[1],
        url: directInBlock[1],
        thumbnail: undefined,
      };
    }
  }

  // Check for direct video URLs (mp4, webm, mov)
  const directMatch = content.match(DIRECT_VIDEO_REGEX);
  if (directMatch) {
    return {
      type: 'direct',
      id: directMatch[1],
      url: directMatch[1],
      thumbnail: undefined,
    };
  }

  return null;
}

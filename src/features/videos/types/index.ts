import type { Article } from '@/src/features/articles';

export interface VideoInfo {
  type: 'direct';
  id: string;
  url: string;
  thumbnail: string;
}

export interface VideoPost extends Article {
  videoInfo?: VideoInfo;
}

export interface VideoPostsResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

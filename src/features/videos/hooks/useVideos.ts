import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_VIDEO_POSTS } from '../queries';
import { extractVideoInfo } from '../utils/videoUtils';
import type { VideoPost, VideoPostsResponse } from '../types';

export function useVideos(first: number = 20) {
  const { data, loading, error, refetch, fetchMore } = useQuery<VideoPostsResponse>(
    GET_VIDEO_POSTS,
    {
      variables: { first },
      fetchPolicy: 'cache-and-network',
    },
  );

  const videoPosts = useMemo<VideoPost[]>(() => {
    if (!data?.posts?.nodes) return [];

    return data.posts.nodes.map(post => ({
      ...post,
      videoInfo: extractVideoInfo(post.content) ?? undefined,
    }));
  }, [data?.posts?.nodes]);

  const loadMore = () => {
    if (!data?.posts?.pageInfo?.hasNextPage) return;

    fetchMore({
      variables: {
        first,
        after: data.posts.pageInfo.endCursor,
      },
    });
  };

  return {
    videos: videoPosts,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: data?.posts?.pageInfo?.hasNextPage ?? false,
  };
}

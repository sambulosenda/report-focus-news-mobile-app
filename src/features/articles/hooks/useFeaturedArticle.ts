import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_FEATURED_POSTS } from '../queries';
import type { Article, FeaturedPostsResponse } from '../types';

export function useFeaturedArticle() {
  const { data, loading, error } = useQuery<FeaturedPostsResponse>(GET_FEATURED_POSTS, {
    variables: { first: 1 },
  });

  const article = useMemo<Article | null>(
    () => data?.posts?.nodes?.[0] ?? null,
    [data?.posts?.nodes],
  );

  return {
    article,
    loading,
    error,
  };
}

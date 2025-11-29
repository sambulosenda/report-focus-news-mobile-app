import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_TRENDING_POSTS } from '../queries';
import type { Article, TrendingPostsResponse } from '../types';

export function useTrendingArticles(excludeIds: string[] = [], limit: number = 6) {
  const { data, loading, error } = useQuery<TrendingPostsResponse>(GET_TRENDING_POSTS, {
    variables: { first: limit, notIn: excludeIds },
  });

  const articles = useMemo<Article[]>(
    () => data?.posts?.nodes ?? [],
    [data?.posts?.nodes],
  );

  return {
    articles,
    loading,
    error,
  };
}

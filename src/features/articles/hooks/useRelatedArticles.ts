import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_RELATED_POSTS } from '../queries';
import type { Article, RelatedPostsResponse } from '../types';

export function useRelatedArticles(
  categoryIds: string[],
  excludeArticleId: string,
  limit: number = 4,
) {
  const { data, loading, error } = useQuery<RelatedPostsResponse>(GET_RELATED_POSTS, {
    variables: {
      categoryIn: categoryIds,
      notIn: [excludeArticleId],
      first: limit,
    },
    skip: categoryIds.length === 0,
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

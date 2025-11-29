import { useQuery } from '@apollo/client/react';
import { useMemo, useCallback } from 'react';
import { GET_POSTS_BY_CATEGORY } from '../queries';
import { config } from '@/src/config/env';
import type { Article, PostsQueryResponse } from '@/src/features/articles';

export function useCategoryArticles(
  categoryId: number | null,
  first: number = config.pagination.defaultPageSize,
) {
  const { data, loading, error, fetchMore, refetch } = useQuery<PostsQueryResponse>(
    GET_POSTS_BY_CATEGORY,
    {
      variables: { categoryId, first },
      skip: categoryId === null,
      notifyOnNetworkStatusChange: true,
    },
  );

  const articles = useMemo<Article[]>(
    () => data?.posts?.nodes ?? [],
    [data?.posts?.nodes],
  );

  const pageInfo = data?.posts?.pageInfo;

  const loadMore = useCallback(() => {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      fetchMore({ variables: { after: pageInfo.endCursor } });
    }
  }, [pageInfo, fetchMore]);

  return {
    articles,
    loading,
    error,
    loadMore,
    refetch,
    hasMore: pageInfo?.hasNextPage ?? false,
  };
}

import { useQuery } from '@apollo/client/react';
import { useMemo, useCallback } from 'react';
import { GET_POSTS } from '../graphql/queries';
import { PostsQueryResponse, Article } from '../types/article';

export function useArticles(first: number = 10) {
  const { data, loading, error, fetchMore, refetch } = useQuery<PostsQueryResponse>(
    GET_POSTS,
    {
      variables: { first },
      notifyOnNetworkStatusChange: true,
    }
  );

  const articles = useMemo<Article[]>(
    () => data?.posts?.nodes ?? [],
    [data?.posts?.nodes]
  );

  const pageInfo = data?.posts?.pageInfo;

  const loadMore = useCallback(() => {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      fetchMore({
        variables: { after: pageInfo.endCursor },
      });
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

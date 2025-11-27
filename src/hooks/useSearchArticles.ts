import { useLazyQuery } from '@apollo/client/react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { SEARCH_POSTS } from '../graphql/queries';
import { Article } from '../types/article';

interface SearchPostsResponse {
  posts: {
    nodes: Article[];
  };
}

export function useSearchArticles(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [executeSearch, { data, loading, error }] = useLazyQuery<SearchPostsResponse>(
    SEARCH_POSTS,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      executeSearch({
        variables: { search: debouncedQuery, first: 20 },
      });
    }
  }, [debouncedQuery, executeSearch]);

  const results = data?.posts?.nodes ?? [];

  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clear,
    hasSearched: debouncedQuery.length >= 2,
  };
}

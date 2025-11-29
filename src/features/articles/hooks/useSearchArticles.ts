import { useLazyQuery } from '@apollo/client/react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { SEARCH_POSTS } from '../queries';
import { config } from '@/src/config/env';
import type { Article, SearchPostsResponse } from '../types';

export function useSearchArticles(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [executeSearch, { data, loading, error }] = useLazyQuery<SearchPostsResponse>(SEARCH_POSTS, {
    fetchPolicy: 'cache-and-network',
  });

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
        variables: { search: debouncedQuery, first: config.pagination.searchPageSize },
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

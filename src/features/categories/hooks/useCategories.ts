import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_CATEGORIES } from '../queries';
import type { CategoriesResponse, CategoryItem } from '../types';

export function useCategories(first: number = 20) {
  const { data, loading, error } = useQuery<CategoriesResponse>(GET_CATEGORIES, {
    variables: { first },
  });

  const categories = useMemo<CategoryItem[]>(
    () => data?.categories?.nodes ?? [],
    [data?.categories?.nodes],
  );

  return {
    categories,
    loading,
    error,
  };
}

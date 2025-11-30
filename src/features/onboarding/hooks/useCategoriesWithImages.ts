import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_CATEGORIES_WITH_IMAGES } from '../queries';

export interface CategoryWithImage {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
  imageUrl?: string;
}

interface CategoryNode {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
  posts: {
    nodes: Array<{
      featuredImage?: {
        node?: {
          sourceUrl?: string;
        };
      };
    }>;
  };
}

interface CategoriesWithImagesResponse {
  categories: {
    nodes: CategoryNode[];
  };
}

export function useCategoriesWithImages(first: number = 20) {
  const { data, loading, error } = useQuery<CategoriesWithImagesResponse>(
    GET_CATEGORIES_WITH_IMAGES,
    {
      variables: { first },
    },
  );

  const categories = useMemo<CategoryWithImage[]>(() => {
    if (!data?.categories?.nodes) return [];

    return data.categories.nodes.map(node => ({
      id: node.id,
      databaseId: node.databaseId,
      name: node.name,
      slug: node.slug,
      count: node.count,
      imageUrl: node.posts.nodes[0]?.featuredImage?.node?.sourceUrl,
    }));
  }, [data?.categories?.nodes]);

  return {
    categories,
    loading,
    error,
  };
}

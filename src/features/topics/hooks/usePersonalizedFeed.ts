import { useMemo } from 'react';
import { useArticles } from '@/src/features/articles/hooks/useArticles';
import { useFollowedTopics } from './useFollowedTopics';
import type { Article } from '@/src/features/articles/types';

export function usePersonalizedFeed(first: number = 15) {
  const { articles, loading, error, loadMore, refetch, hasMore } = useArticles(first);
  const { followedTopics } = useFollowedTopics();

  const personalizedArticles = useMemo<Article[]>(() => {
    if (followedTopics.length === 0) {
      return articles;
    }

    const followedIds = new Set(followedTopics.map(t => t.id));

    // Check if article belongs to a followed category
    const isFollowedArticle = (article: Article) =>
      article.categories?.nodes?.some(cat => followedIds.has(cat.id)) ?? false;

    // Separate into followed and other articles
    const followed: Article[] = [];
    const other: Article[] = [];

    for (const article of articles) {
      if (isFollowedArticle(article)) {
        followed.push(article);
      } else {
        other.push(article);
      }
    }

    // Return followed first, then others
    return [...followed, ...other];
  }, [articles, followedTopics]);

  return {
    articles: personalizedArticles,
    loading,
    error,
    loadMore,
    refetch,
    hasMore,
    hasFollowedTopics: followedTopics.length > 0,
  };
}

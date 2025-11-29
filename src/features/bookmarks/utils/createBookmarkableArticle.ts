import type { Article } from '@/src/features/articles/types';
import type { BookmarkedArticle } from '../types';

export function createBookmarkableArticle(article: Article): BookmarkedArticle {
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];

  return {
    id: article.id,
    databaseId: article.databaseId,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content ?? '',
    date: article.date,
    slug: article.slug,
    imageUrl,
    categoryName: category?.name,
    authorName: article.author?.node?.name,
    bookmarkedAt: '',
  };
}

import { client } from '@/src/graphql/client';
import { GET_POSTS, GET_POST, GET_FEATURED_POSTS, SEARCH_POSTS } from '../queries';
import type { Article, PostsQueryResponse, PostQueryResponse } from '../types';

export interface FetchArticlesOptions {
  first: number;
  after?: string;
}

export interface SearchArticlesOptions {
  query: string;
  first: number;
}

export const articleService = {
  async getArticles({ first, after }: FetchArticlesOptions) {
    const { data } = await client.query<PostsQueryResponse>({
      query: GET_POSTS,
      variables: { first, after },
    });
    return data ?? null;
  },

  async getArticle(id: number) {
    const { data } = await client.query<PostQueryResponse>({
      query: GET_POST,
      variables: { id: id.toString() },
    });
    return data?.post ?? null;
  },

  async getFeaturedArticle(): Promise<Article | null> {
    const { data } = await client.query<{ posts: { nodes: Article[] } }>({
      query: GET_FEATURED_POSTS,
      variables: { first: 1 },
    });
    return data?.posts?.nodes?.[0] ?? null;
  },

  async searchArticles({ query, first }: SearchArticlesOptions) {
    const { data } = await client.query<{ posts: { nodes: Article[] } }>({
      query: SEARCH_POSTS,
      variables: { search: query, first },
    });
    return data?.posts?.nodes ?? [];
  },
};

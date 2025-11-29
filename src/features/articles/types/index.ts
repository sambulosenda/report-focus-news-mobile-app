export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: {
    url: string;
  };
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface Article {
  id: string;
  databaseId: number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  slug: string;
  featuredImage?: FeaturedImage;
  categories: {
    nodes: Category[];
  };
  author?: {
    node: Author;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PostsConnection {
  pageInfo: PageInfo;
  nodes: Article[];
}

export interface PostsQueryResponse {
  posts: PostsConnection;
}

export interface PostQueryResponse {
  post: Article;
}

export interface FeaturedPostsResponse {
  posts: {
    nodes: Article[];
  };
}

export interface SearchPostsResponse {
  posts: {
    nodes: Article[];
  };
}

export interface TrendingPostsResponse {
  posts: {
    nodes: Article[];
  };
}

export interface RelatedPostsResponse {
  posts: {
    nodes: Article[];
  };
}

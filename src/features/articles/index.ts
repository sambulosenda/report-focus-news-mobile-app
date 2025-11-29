// Components
export {
  ArticleCard,
  ArticleCardCompact,
  HeroCard,
  TrendingSection,
  TrendingGridCard,
  RelatedArticles,
  RelatedArticleCard,
} from './components';

// Hooks
export {
  useArticles,
  useFeaturedArticle,
  useSearchArticles,
  useTrendingArticles,
  useRelatedArticles,
} from './hooks';

// Types
export type {
  Article,
  Category,
  Author,
  FeaturedImage,
  PageInfo,
  PostsConnection,
  PostsQueryResponse,
  PostQueryResponse,
  TrendingPostsResponse,
  RelatedPostsResponse,
} from './types';

// Services
export { articleService } from './services/articleService';

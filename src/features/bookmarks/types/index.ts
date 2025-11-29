export interface BookmarkedArticle {
  id: string;
  databaseId: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  imageUrl?: string;
  categoryName?: string;
  authorName?: string;
  bookmarkedAt: string;
}

export interface BookmarkState {
  bookmarks: BookmarkedArticle[];
  addBookmark: (article: BookmarkedArticle) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  getBookmark: (id: string) => BookmarkedArticle | undefined;
  clearAllBookmarks: () => void;
}

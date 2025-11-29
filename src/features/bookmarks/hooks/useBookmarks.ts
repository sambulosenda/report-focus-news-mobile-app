import { useCallback } from 'react';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { BookmarkedArticle } from '../types';

export function useBookmarks() {
  const bookmarks = useBookmarkStore(state => state.bookmarks);
  const addBookmark = useBookmarkStore(state => state.addBookmark);
  const removeBookmark = useBookmarkStore(state => state.removeBookmark);
  const clearAllBookmarks = useBookmarkStore(state => state.clearAllBookmarks);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    clearAllBookmarks,
    count: bookmarks.length,
  };
}

export function useIsBookmarked(id: string) {
  return useBookmarkStore(state => state.bookmarks.some(b => b.id === id));
}

export function useToggleBookmark() {
  const addBookmark = useBookmarkStore(state => state.addBookmark);
  const removeBookmark = useBookmarkStore(state => state.removeBookmark);
  const isBookmarked = useBookmarkStore(state => state.isBookmarked);

  const toggleBookmark = useCallback(
    (article: BookmarkedArticle) => {
      if (isBookmarked(article.id)) {
        removeBookmark(article.id);
        return false;
      } else {
        addBookmark(article);
        return true;
      }
    },
    [addBookmark, removeBookmark, isBookmarked],
  );

  return toggleBookmark;
}

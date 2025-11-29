import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookmarkState, BookmarkedArticle } from '../types';

const MAX_BOOKMARKS = 100;

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (article: BookmarkedArticle) =>
        set(state => {
          if (state.bookmarks.some(b => b.id === article.id)) {
            return state;
          }
          const newBookmarks = [
            { ...article, bookmarkedAt: new Date().toISOString() },
            ...state.bookmarks,
          ].slice(0, MAX_BOOKMARKS);
          return { bookmarks: newBookmarks };
        }),

      removeBookmark: (id: string) =>
        set(state => ({
          bookmarks: state.bookmarks.filter(b => b.id !== id),
        })),

      isBookmarked: (id: string) => get().bookmarks.some(b => b.id === id),

      getBookmark: (id: string) => get().bookmarks.find(b => b.id === id),

      clearAllBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'bookmarks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

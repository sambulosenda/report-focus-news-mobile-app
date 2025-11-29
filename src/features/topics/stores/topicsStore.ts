import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FollowedTopicsState, FollowedTopic } from '../types';

export const useTopicsStore = create<FollowedTopicsState>()(
  persist(
    (set, get) => ({
      followedTopics: [],

      followTopic: (topic: Omit<FollowedTopic, 'followedAt'>) =>
        set(state => {
          if (state.followedTopics.some(t => t.id === topic.id)) {
            return state;
          }
          return {
            followedTopics: [
              ...state.followedTopics,
              { ...topic, followedAt: new Date().toISOString() },
            ],
          };
        }),

      unfollowTopic: (id: string) =>
        set(state => ({
          followedTopics: state.followedTopics.filter(t => t.id !== id),
        })),

      isFollowing: (id: string) => get().followedTopics.some(t => t.id === id),

      clearAll: () => set({ followedTopics: [] }),
    }),
    {
      name: 'followed-topics-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import { useCallback } from 'react';
import { useTopicsStore } from '../stores/topicsStore';
import { FollowedTopic } from '../types';

export function useFollowedTopics() {
  const followedTopics = useTopicsStore(state => state.followedTopics);
  const followTopic = useTopicsStore(state => state.followTopic);
  const unfollowTopic = useTopicsStore(state => state.unfollowTopic);
  const clearAll = useTopicsStore(state => state.clearAll);

  return {
    followedTopics,
    followTopic,
    unfollowTopic,
    clearAll,
    count: followedTopics.length,
    followedIds: followedTopics.map(t => t.databaseId),
  };
}

export function useIsFollowing(id: string) {
  return useTopicsStore(state => state.followedTopics.some(t => t.id === id));
}

export function useToggleFollow() {
  const followTopic = useTopicsStore(state => state.followTopic);
  const unfollowTopic = useTopicsStore(state => state.unfollowTopic);
  const isFollowing = useTopicsStore(state => state.isFollowing);

  const toggleFollow = useCallback(
    (topic: Omit<FollowedTopic, 'followedAt'>) => {
      if (isFollowing(topic.id)) {
        unfollowTopic(topic.id);
        return false;
      } else {
        followTopic(topic);
        return true;
      }
    },
    [followTopic, unfollowTopic, isFollowing],
  );

  return toggleFollow;
}

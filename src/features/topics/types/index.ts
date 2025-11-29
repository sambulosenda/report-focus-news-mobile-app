export interface FollowedTopic {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  followedAt: string;
}

export interface FollowedTopicsState {
  followedTopics: FollowedTopic[];
  followTopic: (topic: Omit<FollowedTopic, 'followedAt'>) => void;
  unfollowTopic: (id: string) => void;
  isFollowing: (id: string) => boolean;
  clearAll: () => void;
}

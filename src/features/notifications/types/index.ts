export interface NotificationSettings {
  masterEnabled: boolean;
  breakingNewsEnabled: boolean;
  topicNotifications: Record<string, boolean>;
  lastPermissionCheck: string | null;
}

export interface ReceivedNotification {
  id: string;
  title: string;
  body: string;
  articleId?: string;
  categoryId?: string;
  type: 'breaking' | 'topic' | 'general';
  receivedAt: string;
  read: boolean;
  imageUrl?: string;
}

export interface NotificationSettingsState {
  settings: NotificationSettings;
  setMasterEnabled: (enabled: boolean) => void;
  setBreakingNewsEnabled: (enabled: boolean) => void;
  setTopicNotification: (topicId: string, enabled: boolean) => void;
  syncWithFollowedTopics: (topicIds: string[]) => void;
}

export interface NotificationHistoryState {
  notifications: ReceivedNotification[];
  addNotification: (
    notification: Omit<ReceivedNotification, 'id' | 'receivedAt' | 'read'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export interface DeviceTokenData {
  token: string;
  platform: 'ios' | 'android';
  deviceId: string;
  followedTopicIds: number[];
  breakingNewsEnabled: boolean;
}

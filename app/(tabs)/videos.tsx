import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideos, VideoCard, type VideoPost } from '@/src/features/videos';
import { ErrorView } from '@/src/shared/components';

export default function VideosScreen() {
  const { videos, loading, error, refetch, loadMore, hasMore } = useVideos();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: VideoPost }) => <VideoCard video={item} />,
    [],
  );

  const keyExtractor = useCallback((item: VideoPost) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">Videos</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Watch the latest news videos
        </Text>
      </View>
    ),
    [],
  );

  const ListFooter = useCallback(
    () =>
      loading && videos.length > 0 ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : null,
    [loading, videos.length],
  );

  const ListEmpty = useCallback(
    () =>
      !loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            No videos found
          </Text>
        </View>
      ) : null,
    [loading],
  );

  if (loading && videos.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">Videos</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-3">Loading videos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && videos.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
        <ErrorView message="Failed to load videos" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={hasMore && videos.length > 0 ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

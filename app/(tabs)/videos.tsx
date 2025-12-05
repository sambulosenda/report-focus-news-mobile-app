import React, { useCallback, useState } from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useVideos, VideoCard, type VideoPost } from '@/src/features/videos';
import { ErrorView, NativeHeader } from '@/src/shared/components';

export default function VideosScreen() {
  const { videos, loading, error, refetch, loadMore, hasMore } = useVideos();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to refresh videos:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: VideoPost }) => <VideoCard video={item} />,
    [],
  );

  const keyExtractor = useCallback((item: VideoPost) => item.id, []);

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
      <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
        <View className="px-4 h-[100px] justify-center">
          <Text className="text-[34px] font-bold text-gray-900 dark:text-white tracking-tight">
            Videos
          </Text>
          <Text className="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
            Watch the latest news videos
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-3">Loading videos...</Text>
        </View>
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
        <ErrorView message="Failed to load videos" onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <NativeHeader
        scrollY={scrollY}
        title="Videos"
        subtitle="Watch the latest news videos"
      />

      <Animated.FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={hasMore && videos.length > 0 ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

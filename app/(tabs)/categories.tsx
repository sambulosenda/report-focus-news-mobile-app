import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useCategories } from '@/src/features/categories';
import { useIsFollowing, useToggleFollow } from '@/src/features/topics';
import { haptics } from '@/src/shared/utils/haptics';
import { Icon, NativeHeader, ErrorView } from '@/src/shared/components';

interface CategoryRowProps {
  category: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
  };
}

function CategoryRow({ category }: CategoryRowProps) {
  const router = useRouter();
  const isFollowing = useIsFollowing(category.id);
  const toggleFollow = useToggleFollow();

  const handlePress = () => {
    haptics.selection();
    // Navigate to category articles - you can implement this route later
    // router.push(`/category/${category.slug}`);
  };

  const handleFollowPress = () => {
    haptics.medium();
    toggleFollow({
      id: category.id,
      databaseId: category.databaseId,
      name: category.name,
      slug: category.slug,
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-neutral-800"
    >
      <View className="flex-1">
        <Text className="text-[17px] text-gray-900 dark:text-white">
          {category.name}
        </Text>
      </View>
      <Pressable
        onPress={handleFollowPress}
        className={`px-4 py-1.5 rounded-full ${
          isFollowing ? 'bg-gray-200 dark:bg-neutral-700' : 'bg-accent'
        }`}
        hitSlop={8}
      >
        <Text
          className={`text-[15px] font-medium ${
            isFollowing ? 'text-gray-700 dark:text-gray-300' : 'text-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default function CategoriesScreen() {
  const { categories, loading, error, refetch } = useCategories();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (error) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <NativeHeader scrollY={scrollY} title="Categories" />
        <ErrorView message={error.message} onRetry={refetch} />
      </View>
    );
  }

  const renderItem = useCallback(
    ({ item }: { item: CategoryRowProps['category'] }) => (
      <CategoryRow category={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: CategoryRowProps['category']) => item.id,
    []
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <NativeHeader scrollY={scrollY} title="Categories" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading categories...</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Icon name="grid" size={48} color="#9ca3af" />
              <Text className="text-gray-500 dark:text-gray-400 mt-4">
                No categories found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { navigationService } from '@/src/navigation/routes';
import { formatArticleDate } from '@/src/shared/formatters/dates';
import { stripHtml } from '@/src/shared/utils/html';
import { haptics } from '@/src/shared/utils/haptics';
import { AnimatedPressable, Icon } from '@/src/shared/components';
import { useBookmarkStore } from '../stores/bookmarkStore';
import type { BookmarkedArticle } from '../types';

interface BookmarkedArticleCardProps {
  article: BookmarkedArticle;
}

export const BookmarkedArticleCard = memo(function BookmarkedArticleCard({
  article,
}: BookmarkedArticleCardProps) {
  const removeBookmark = useBookmarkStore(state => state.removeBookmark);
  const formattedDate = formatArticleDate(article.date);
  const excerpt = stripHtml(article.excerpt).slice(0, 100);

  const handlePress = () => {
    haptics.light();
    navigationService.goToArticle(article.databaseId);
  };

  const handleRemove = () => {
    haptics.light();
    removeBookmark(article.id);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="flex-row mx-4 mb-3 p-3 bg-white dark:bg-gray-900 rounded-xl">
      <View className="flex-1 pr-3">
        {article.categoryName && (
          <Text className="text-accent text-xs font-semibold uppercase mb-1">
            {article.categoryName}
          </Text>
        )}
        <Text
          className="text-gray-900 dark:text-white font-semibold text-base mb-1"
          numberOfLines={2}>
          {article.title}
        </Text>
        {excerpt && (
          <Text
            className="text-gray-600 dark:text-gray-400 text-sm mb-2"
            numberOfLines={2}>
            {excerpt}
          </Text>
        )}
        <Text className="text-gray-500 dark:text-gray-500 text-xs">
          {formattedDate}
        </Text>
      </View>
      <View className="items-end">
        {article.imageUrl && (
          <View className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 mb-2">
            <Image
              source={{ uri: article.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}
        <Pressable
          onPress={handleRemove}
          hitSlop={8}
          className="p-1">
          <Icon name="bookmark-fill" size={20} color="#007AFF" />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
});

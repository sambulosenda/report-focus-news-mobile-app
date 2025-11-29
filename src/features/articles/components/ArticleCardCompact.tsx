import { memo } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { navigationService } from '@/src/navigation/routes';
import { formatArticleDate } from '@/src/shared/formatters/dates';
import { stripHtml } from '@/src/shared/utils/html';
import { getReadingTimeDisplay } from '@/src/shared/utils/readingTime';
import { haptics } from '@/src/shared/utils/haptics';
import { AnimatedPressable } from '@/src/shared/components';
import type { Article } from '../types';

interface ArticleCardCompactProps {
  article: Article;
}

export const ArticleCardCompact = memo(function ArticleCardCompact({
  article,
}: ArticleCardCompactProps) {
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];
  const formattedDate = formatArticleDate(article.date);
  const readingTime = getReadingTimeDisplay(article.excerpt);
  const excerpt = stripHtml(article.excerpt).slice(0, 80);

  const handlePress = () => {
    haptics.light();
    navigationService.goToArticle(article.databaseId);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="flex-row mx-4 py-3 border-b border-gray-200 dark:border-gray-800">
      {imageUrl && (
        <View className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 mr-3">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          {category && (
            <Text className="text-accent text-xs font-semibold uppercase mr-2">{category.name}</Text>
          )}
        </View>
        <Text className="text-gray-900 dark:text-white font-medium text-base" numberOfLines={2}>
          {article.title}
        </Text>
        {excerpt && (
          <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1" numberOfLines={1}>
            {excerpt}...
          </Text>
        )}
        <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          {formattedDate} · {readingTime}
        </Text>
      </View>
    </AnimatedPressable>
  );
});

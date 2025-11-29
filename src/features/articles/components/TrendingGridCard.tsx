import { memo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { navigationService } from '@/src/navigation/routes';
import type { Article } from '../types';

interface TrendingGridCardProps {
  article: Article;
}

export const TrendingGridCard = memo(function TrendingGridCard({
  article,
}: TrendingGridCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 48) / 2; // 16px padding on sides + 16px gap
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];

  return (
    <Pressable
      onPress={() => navigationService.goToArticle(article.databaseId)}
      style={{ width: cardWidth }}
      className="mb-4 active:opacity-80">
      <View className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-[4/3]">
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )}
      </View>
      {category && (
        <Text className="text-accent text-xs font-semibold uppercase mt-2">
          {category.name}
        </Text>
      )}
      <Text
        className="text-sm font-semibold text-gray-900 dark:text-white mt-1"
        numberOfLines={2}>
        {article.title}
      </Text>
    </Pressable>
  );
});

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { navigationService } from '@/src/navigation/routes';
import type { Article } from '../types';

interface RelatedArticleCardProps {
  article: Article;
}

export const RelatedArticleCard = memo(function RelatedArticleCard({
  article,
}: RelatedArticleCardProps) {
  const imageUrl = article.featuredImage?.node?.sourceUrl;

  return (
    <Pressable
      onPress={() => navigationService.goToArticle(article.databaseId)}
      className="w-40 mr-3 active:opacity-80">
      <View className="h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 mb-2">
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )}
      </View>
      <Text
        className="text-sm font-medium text-gray-900 dark:text-white"
        numberOfLines={2}>
        {article.title}
      </Text>
    </Pressable>
  );
});

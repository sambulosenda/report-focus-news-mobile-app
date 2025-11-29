import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { navigationService } from '@/src/navigation/routes';
import { formatArticleDateFull } from '@/src/shared/formatters/dates';
import { getReadingTimeDisplay } from '@/src/shared/utils/readingTime';
import type { Article } from '../types';

interface HeroCardProps {
  article: Article;
}

export const HeroCard = memo(function HeroCard({ article }: HeroCardProps) {
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];
  const formattedDate = formatArticleDateFull(article.date);
  const readingTime = getReadingTimeDisplay(article.excerpt);

  const handlePress = () => {
    navigationService.goToArticle(article.databaseId);
  };

  return (
    <Pressable onPress={handlePress} className="mx-4 mb-4">
      <View className="h-72 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '60%',
          }}
        />
        <View className="absolute bottom-0 left-0 right-0 p-4">
          {category && (
            <View className="bg-accent/90 self-start px-2 py-1 rounded mb-2">
              <Text className="text-white text-xs font-semibold uppercase">{category.name}</Text>
            </View>
          )}
          <Text className="text-white text-xl font-bold mb-1" numberOfLines={2}>
            {article.title}
          </Text>
          <Text className="text-white/70 text-sm">{formattedDate} · {readingTime}</Text>
        </View>
      </View>
    </Pressable>
  );
});

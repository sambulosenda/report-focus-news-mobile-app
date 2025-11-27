import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export const ArticleCard = memo(function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];
  const formattedDate = article.date
    ? format(new Date(article.date), 'MMM d')
    : '';
  const excerpt = stripHtml(article.excerpt || '').slice(0, 100);

  const handlePress = () => {
    router.push(`/article/${article.databaseId}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row mx-4 mb-3 p-3 bg-white dark:bg-gray-900 rounded-xl active:opacity-80"
    >
      <View className="flex-1 pr-3">
        {category && (
          <Text className="text-accent text-xs font-semibold uppercase mb-1">
            {category.name}
          </Text>
        )}
        <Text
          className="text-gray-900 dark:text-white font-semibold text-base mb-1"
          numberOfLines={2}
        >
          {article.title}
        </Text>
        {excerpt && (
          <Text
            className="text-gray-600 dark:text-gray-400 text-sm mb-2"
            numberOfLines={2}
          >
            {excerpt}
          </Text>
        )}
        <Text className="text-gray-500 dark:text-gray-500 text-xs">
          {formattedDate}
        </Text>
      </View>
      {imageUrl && (
        <View className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>
      )}
    </Pressable>
  );
});

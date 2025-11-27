import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Article } from '../types/article';

interface ArticleCardCompactProps {
  article: Article;
}

export const ArticleCardCompact = memo(function ArticleCardCompact({
  article,
}: ArticleCardCompactProps) {
  const router = useRouter();
  const category = article.categories?.nodes?.[0];
  const formattedDate = article.date ? format(new Date(article.date), 'MMM d') : '';

  const handlePress = () => {
    router.push(`/article/${article.databaseId}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mx-4 py-3 border-b border-gray-200 dark:border-gray-800 active:opacity-80">
      <View className="flex-row items-center mb-1">
        {category && (
          <Text className="text-accent text-xs font-semibold uppercase mr-2">{category.name}</Text>
        )}
        <Text className="text-gray-500 dark:text-gray-500 text-xs">{formattedDate}</Text>
      </View>
      <Text className="text-gray-900 dark:text-white font-medium text-base" numberOfLines={2}>
        {article.title}
      </Text>
    </Pressable>
  );
});

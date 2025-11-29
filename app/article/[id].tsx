import React, { useState } from 'react';
import {
  View,
  Text,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import RenderHtml from 'react-native-render-html';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { GET_POST } from '@/src/features/articles/queries';
import {
  type PostQueryResponse,
  RelatedArticles,
  ArticleHeader,
  ParallaxHero,
} from '@/src/features/articles';
import { LoadingSpinner, ErrorView } from '@/src/shared/components';
import { getReadingTimeDisplay } from '@/src/shared/utils/readingTime';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const scrollY = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(1000);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleContentSizeChange = (_width: number, height: number) => {
    setContentHeight(height);
  };

  const { data, loading, error, refetch } = useQuery<PostQueryResponse>(GET_POST, {
    variables: { id },
  });

  const article = data?.post;
  const imageUrl = article?.featuredImage?.node?.sourceUrl;
  const category = article?.categories?.nodes?.[0];
  const author = article?.author?.node;
  const readingTime = getReadingTimeDisplay(article?.content);
  const categoryIds = article?.categories?.nodes?.map(c => c.id) ?? [];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <ErrorView message="Failed to load article" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Animated Header with Progress */}
      <ArticleHeader
        scrollY={scrollY}
        title={article.title}
        contentHeight={contentHeight}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {/* Parallax Hero Image */}
        {imageUrl ? (
          <ParallaxHero imageUrl={imageUrl} scrollY={scrollY} />
        ) : (
          <View className="h-[300px] bg-gray-200 dark:bg-neutral-800" />
        )}

        <View className="px-5 pt-5">
          {/* Category Badge */}
          {category && (
            <View className="self-start mb-3">
              <Text className="text-blue-500 text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {category.name}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text className="text-[28px] font-bold mb-4 leading-tight text-gray-900 dark:text-white">
            {article.title}
          </Text>

          {/* Author & Meta */}
          <View className="flex-row items-center mb-6 pb-6 border-b border-gray-100 dark:border-neutral-800">
            {author?.avatar?.url && (
              <Image
                source={{ uri: author.avatar.url }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
            )}
            <View className="ml-3 flex-1">
              {author && (
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  {author.name}
                </Text>
              )}
              <View className="flex-row items-center">
                {article.date && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(article.date), 'MMM d, yyyy')}
                  </Text>
                )}
                <Text className="text-sm text-gray-500 dark:text-gray-400"> · {readingTime}</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          {article.content && (
            <RenderHtml
              contentWidth={width - 40}
              source={{ html: article.content }}
              baseStyle={{
                color: isDark ? '#e5e5e5' : '#1f2937',
                fontSize: 18,
                lineHeight: 30,
              }}
              tagsStyles={{
                p: { marginBottom: 20 },
                a: { color: '#007AFF', textDecorationLine: 'none' },
                h2: {
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginTop: 32,
                  marginBottom: 16,
                  color: isDark ? '#fff' : '#111827',
                },
                h3: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 28,
                  marginBottom: 12,
                  color: isDark ? '#fff' : '#111827',
                },
                img: { borderRadius: 12, marginVertical: 20 },
                blockquote: {
                  borderLeftWidth: 4,
                  borderLeftColor: '#007AFF',
                  paddingLeft: 20,
                  marginVertical: 24,
                  fontStyle: 'italic',
                  backgroundColor: isDark ? '#1f1f1f' : '#f9fafb',
                  paddingVertical: 16,
                  paddingRight: 16,
                  borderRadius: 4,
                },
                ul: { marginBottom: 16 },
                ol: { marginBottom: 16 },
                li: { marginBottom: 8 },
              }}
            />
          )}
        </View>

        {/* Related Articles */}
        <RelatedArticles categoryIds={categoryIds} currentArticleId={article.id} />
      </Animated.ScrollView>
    </View>
  );
}

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import RenderHtml from 'react-native-render-html';
import { GET_POST } from '../../src/graphql/queries';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { ErrorView } from '../../src/components/ErrorView';
import { PostQueryResponse } from '../../src/types/article';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data, loading, error, refetch } = useQuery<PostQueryResponse>(GET_POST, {
    variables: { id },
  });

  const article = data?.post;
  const imageUrl = article?.featuredImage?.node?.sourceUrl;
  const category = article?.categories?.nodes?.[0];
  const author = article?.author?.node;

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
      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-white dark:bg-black">
        <View className="flex-row items-center px-4 py-2">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        {imageUrl && (
          <View className="h-64 bg-gray-200 dark:bg-neutral-800">
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        <View className="px-4 pt-4">
          {/* Category */}
          {category && (
            <Text className="text-blue-500 text-sm font-semibold uppercase mb-2">
              {category.name}
            </Text>
          )}

          {/* Title */}
          <Text className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {article.title}
          </Text>

          {/* Meta */}
          <View className="flex-row items-center mb-4">
            {author && (
              <Text className="text-sm mr-3 text-gray-600 dark:text-gray-400">
                By {author.name}
              </Text>
            )}
            {article.date && (
              <Text className="text-sm text-gray-500">
                {format(new Date(article.date), 'MMMM d, yyyy')}
              </Text>
            )}
          </View>

          {/* Content */}
          {article.content && (
            <RenderHtml
              contentWidth={width - 32}
              source={{ html: article.content }}
              baseStyle={{
                color: isDark ? '#fff' : '#000',
                fontSize: 17,
                lineHeight: 26,
              }}
              tagsStyles={{
                p: { marginBottom: 16 },
                a: { color: '#007AFF' },
                h2: {
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginTop: 24,
                  marginBottom: 12,
                },
                h3: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                },
                img: { borderRadius: 8, marginVertical: 16 },
                blockquote: {
                  borderLeftWidth: 3,
                  borderLeftColor: '#007AFF',
                  paddingLeft: 16,
                  marginVertical: 16,
                  fontStyle: 'italic',
                },
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

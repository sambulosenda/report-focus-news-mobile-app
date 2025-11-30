import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { GET_POST } from '@/src/features/articles/queries';
import type { PostQueryResponse } from '@/src/features/articles';
import { VideoPlayer, extractVideoInfo } from '@/src/features/videos';
import { LoadingSpinner, ErrorView } from '@/src/shared/components';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<PostQueryResponse>(GET_POST, {
    variables: { id },
  });

  const article = data?.post;
  const videoInfo = extractVideoInfo(article?.content);
  const category = article?.categories?.nodes?.[0];
  const author = article?.author?.node;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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
        <ErrorView message="Failed to load video" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-white dark:bg-black">
        <View className="flex-row items-center px-4 py-2">
          <Pressable
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
          >
            <Ionicons name="arrow-back" size={22} color="#007AFF" />
          </Pressable>
          <Text className="flex-1 ml-3 text-lg font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
            Video
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        {videoInfo ? (
          <VideoPlayer videoInfo={videoInfo} />
        ) : (
          <View className="aspect-video bg-gray-200 dark:bg-neutral-800 items-center justify-center">
            <Ionicons name="videocam-off" size={48} color="#666" />
            <Text className="text-gray-500 mt-2">Video not available</Text>
          </View>
        )}

        {/* Content */}
        <View className="px-4 pt-4 pb-8">
          {/* Category */}
          {category && (
            <Text className="text-xs font-bold text-accent uppercase tracking-wide mb-2">
              {category.name}
            </Text>
          )}

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </Text>

          {/* Author & Date */}
          <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100 dark:border-neutral-800">
            {author?.avatar?.url && (
              <Image
                source={{ uri: author.avatar.url }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                contentFit="cover"
              />
            )}
            <View className="ml-3">
              {author && (
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {author.name}
                </Text>
              )}
              {article.date && (
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(article.date), 'MMM d, yyyy')}
                </Text>
              )}
            </View>
          </View>

          {/* Excerpt */}
          {article.excerpt && (
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {article.excerpt.replace(/<[^>]*>/g, '')}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

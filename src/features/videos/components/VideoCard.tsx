import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import type { VideoPost } from '../types';
import { Icon } from '@/src/shared/components';

interface VideoCardProps {
  video: VideoPost;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const category = video.categories?.nodes?.[0];
  const thumbnail = video.videoInfo?.thumbnail || video.featuredImage?.node?.sourceUrl;

  const handlePress = () => {
    router.push({
      pathname: '/video/[id]',
      params: { id: video.databaseId.toString() },
    });
  };

  return (
    <Pressable onPress={handlePress} className="mx-4 mb-4">
      {/* Thumbnail with play overlay */}
      <View className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-neutral-800">
        <View className="aspect-video">
          {thumbnail && (
            <Image
              source={{ uri: thumbnail }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          )}
        </View>

        {/* Play button overlay */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-black/60 items-center justify-center">
            <Icon name="play" size={32} color="#fff" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Video source badge */}
        {video.videoInfo?.type && (
          <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded">
            <Text className="text-white text-xs font-semibold uppercase">
              {video.videoInfo.type}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="mt-3">
        {category && (
          <Text className="text-xs font-semibold text-accent uppercase mb-1">
            {category.name}
          </Text>
        )}
        <Text
          className="text-base font-semibold text-gray-900 dark:text-white"
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {format(new Date(video.date), 'MMM d, yyyy')}
        </Text>
      </View>
    </Pressable>
  );
}

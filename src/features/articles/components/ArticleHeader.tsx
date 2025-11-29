import React from 'react';
import { View, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { Share } from 'react-native';

interface ArticleHeaderProps {
  scrollY: SharedValue<number>;
  title: string;
  contentHeight: number;
}

const HERO_HEIGHT = 300;
const TITLE_APPEAR_THRESHOLD = HERO_HEIGHT - 100;

export function ArticleHeader({ scrollY, title, contentHeight }: ArticleHeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: title,
      });
    } catch {
      // Ignore share errors
    }
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement bookmark functionality
  };

  // Progress bar animation
  const progressStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, contentHeight],
      [0, 100],
      Extrapolation.CLAMP,
    );
    return {
      width: `${progress}%`,
    };
  });

  // Title opacity animation (appears after scrolling past hero)
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [TITLE_APPEAR_THRESHOLD - 50, TITLE_APPEAR_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Header background opacity
  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [TITLE_APPEAR_THRESHOLD - 100, TITLE_APPEAR_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <View className="absolute top-0 left-0 right-0 z-10">
      {/* Progress bar */}
      <View className="h-0.5 bg-gray-200 dark:bg-neutral-800">
        <Animated.View
          style={progressStyle}
          className="h-full bg-blue-500"
        />
      </View>

      <SafeAreaView edges={['top']}>
        {/* Background overlay */}
        <Animated.View
          style={headerBgStyle}
          className="absolute inset-0 bg-white dark:bg-black"
        />

        <View className="flex-row items-center justify-between px-4 py-2">
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-black/20 dark:bg-white/20"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          {/* Animated title */}
          <Animated.Text
            style={titleStyle}
            className="flex-1 mx-3 text-base font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {title}
          </Animated.Text>

          {/* Action buttons */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleShare}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/20 dark:bg-white/20"
            >
              <Ionicons name="share-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable
              onPress={handleBookmark}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/20 dark:bg-white/20"
            >
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

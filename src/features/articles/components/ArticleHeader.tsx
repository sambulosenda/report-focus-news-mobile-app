import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import {
  useIsBookmarked,
  useToggleBookmark,
  BookmarkedArticle,
} from '@/src/features/bookmarks';
import { ShareModal, type ShareableArticle } from '@/src/features/sharing';

export interface ArticleHeaderProps {
  scrollY: SharedValue<number>;
  title: string;
  contentHeight: SharedValue<number>;
  viewportHeight: number;
  articleUrl?: string;
  article?: BookmarkedArticle;
  shareableArticle?: ShareableArticle;
}

const HERO_HEIGHT = 300;
const TITLE_APPEAR_THRESHOLD = HERO_HEIGHT - 100;

export function ArticleHeader({
  scrollY,
  title,
  contentHeight,
  viewportHeight,
  articleUrl,
  article,
  shareableArticle,
}: ArticleHeaderProps) {
  const router = useRouter();
  const isBookmarked = useIsBookmarked(article?.id ?? '');
  const toggleBookmark = useToggleBookmark();
  const bookmarkScale = useSharedValue(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowShareModal(true);
  };

  const handleBookmark = () => {
    if (!article) return;

    bookmarkScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 }),
    );

    const wasBookmarked = toggleBookmark(article);
    Haptics.impactAsync(
      wasBookmarked
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    );
  };

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  // Progress bar animation
  const progressStyle = useAnimatedStyle(() => {
    const maxScroll = Math.max(0, contentHeight.value - viewportHeight);
    const progress = interpolate(
      scrollY.value,
      [0, maxScroll],
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

  // Icon color - white works on both hero (dark gradient) and dark mode header
  // In light mode with scrolled header, buttons have bg-black/20 so white still visible
  const iconColor = '#fff';

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
            <Ionicons name="arrow-back" size={22} color={iconColor} />
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
              <Ionicons name="share-outline" size={20} color={iconColor} />
            </Pressable>
            <Pressable
              onPress={handleBookmark}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/20 dark:bg-white/20"
            >
              <Animated.View style={bookmarkAnimatedStyle}>
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isBookmarked ? '#007AFF' : iconColor}
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Share Modal */}
      {shareableArticle && (
        <ShareModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          article={shareableArticle}
        />
      )}
    </View>
  );
}

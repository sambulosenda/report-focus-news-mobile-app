import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useIsBookmarked, useToggleBookmark } from '../hooks/useBookmarks';
import { BookmarkedArticle } from '../types';
import { Icon } from '@/src/shared/components';

interface BookmarkButtonProps {
  article: BookmarkedArticle;
  size?: number;
  color?: string;
  activeColor?: string;
}

export function BookmarkButton({
  article,
  size = 24,
  color = '#666',
  activeColor = '#007AFF',
}: BookmarkButtonProps) {
  const isBookmarked = useIsBookmarked(article.id);
  const toggleBookmark = useToggleBookmark();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
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

  return (
    <Pressable onPress={handlePress} hitSlop={12}>
      <Animated.View style={animatedStyle}>
        <Icon
          name={isBookmarked ? 'bookmark-fill' : 'bookmark'}
          size={size}
          color={isBookmarked ? activeColor : color}
        />
      </Animated.View>
    </Pressable>
  );
}

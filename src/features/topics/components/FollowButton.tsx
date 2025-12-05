import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useIsFollowing, useToggleFollow } from '../hooks/useFollowedTopics';
import { FollowedTopic } from '../types';
import { Icon } from '@/src/shared/components';

interface FollowButtonProps {
  topic: Omit<FollowedTopic, 'followedAt'>;
  size?: number;
  color?: string;
  activeColor?: string;
}

export function FollowButton({
  topic,
  size = 18,
  color = '#9ca3af',
  activeColor = '#007AFF',
}: FollowButtonProps) {
  const isFollowing = useIsFollowing(topic.id);
  const toggleFollow = useToggleFollow();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 }),
    );

    const nowFollowing = toggleFollow(topic);
    Haptics.impactAsync(
      nowFollowing
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    );
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={animatedStyle}>
        <Icon
          name={isFollowing ? 'heart-fill' : 'heart'}
          size={size}
          color={isFollowing ? activeColor : color}
        />
      </Animated.View>
    </Pressable>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';

interface CollapsibleHeaderProps {
  scrollY: SharedValue<number>;
  title?: string;
  subtitle?: string;
}

const EXPANDED_HEIGHT = 72;
const COLLAPSED_HEIGHT = 44;
const SCROLL_THRESHOLD = 80;

export function CollapsibleHeader({
  scrollY,
  title = 'Report Focus',
  subtitle = 'Stay informed with the latest news',
}: CollapsibleHeaderProps) {
  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const titleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [28, 18],
      Extrapolation.CLAMP,
    );
    return { fontSize };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [0, -10],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <Animated.View
      style={containerStyle}
      className="bg-white dark:bg-black px-4 justify-center"
    >
      <Animated.Text
        style={titleStyle}
        className="font-bold text-gray-900 dark:text-white"
      >
        {title}
      </Animated.Text>
      <Animated.Text
        style={subtitleStyle}
        className="text-sm text-gray-600 dark:text-gray-400 mt-0.5"
      >
        {subtitle}
      </Animated.Text>
    </Animated.View>
  );
}

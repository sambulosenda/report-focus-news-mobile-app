import { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function Skeleton({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonProps) {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(translateX.value, [-1, 1], [-200, 200]) }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          overflow: 'hidden',
        },
        style,
      ]}
      className="dark:bg-gray-800">
      <AnimatedLinearGradient
        colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, animatedStyle]}
      />
    </View>
  );
}

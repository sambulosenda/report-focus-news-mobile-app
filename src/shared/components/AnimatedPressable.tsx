import { ReactNode } from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  children: ReactNode;
  scale?: number;
  className?: string;
  style?: ViewStyle;
}

export function AnimatedPressable({
  children,
  scale = 0.97,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = (e: any) => {
    scaleValue.value = withSpring(scale, { damping: 15, stiffness: 400 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPressOut?.(e);
  };

  return (
    <AnimatedPressableBase
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      {...props}>
      {children}
    </AnimatedPressableBase>
  );
}

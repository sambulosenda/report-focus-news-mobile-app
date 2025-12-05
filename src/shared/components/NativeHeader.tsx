import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useEffectiveTheme } from '@/src/features/theme';

interface NativeHeaderProps {
  scrollY: SharedValue<number>;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  showBorder?: boolean;
}

const SMALL_TITLE_HEIGHT = 44;
const SCROLL_DISTANCE = 80;

export function NativeHeader({
  scrollY,
  title,
  subtitle,
  children,
  showBorder = true,
}: NativeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useEffectiveTheme();
  const bgColor = isDark ? '#000' : '#fff';

  // Large title section - collapses (height goes to 0)
  const largeTitleContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [subtitle ? 64 : 48, 0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  // Small title in navbar - appears as you scroll
  const smallTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Border opacity (shows when scrolled)
  const borderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.8, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Small title bar height - collapses when at top, expands when scrolled
  const smallTitleBarStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, SMALL_TITLE_HEIGHT],
      Extrapolation.CLAMP
    );
    return { height };
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: bgColor },
      ]}
    >
      {/* Small title bar - hidden at top, appears on scroll */}
      <Animated.View style={[styles.smallTitleBar, smallTitleBarStyle]}>
        <Animated.Text
          style={[
            styles.smallTitle,
            { color: isDark ? '#fff' : '#000' },
            smallTitleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Animated.Text>
      </Animated.View>

      {/* Large title section - collapses on scroll */}
      <Animated.View style={[styles.largeTitleContainer, largeTitleContainerStyle]}>
        <Text
          style={[styles.largeTitle, { color: isDark ? '#fff' : '#000' }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}
          >
            {subtitle}
          </Text>
        )}
      </Animated.View>

      {/* Optional children (e.g., category chips) */}
      {children}

      {/* Bottom border */}
      {showBorder && (
        <Animated.View
          style={[
            styles.border,
            { backgroundColor: isDark ? '#333' : '#e5e5e5' },
            borderStyle,
          ]}
        />
      )}
    </View>
  );
}

// Static large title header for screens without scroll tracking
interface StaticLargeTitleProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
}

export function StaticLargeTitle({ title, subtitle, rightElement }: StaticLargeTitleProps) {
  const { isDark } = useEffectiveTheme();

  return (
    <View style={styles.staticContainer}>
      <View style={styles.staticTitleRow}>
        <Text style={[styles.largeTitle, { color: isDark ? '#fff' : '#000' }]}>
          {title}
        </Text>
        {rightElement}
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  smallTitleBar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    overflow: 'hidden',
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  largeTitleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    transformOrigin: 'left center',
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 2,
  },
  border: {
    height: StyleSheet.hairlineWidth,
  },
  staticContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  staticTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

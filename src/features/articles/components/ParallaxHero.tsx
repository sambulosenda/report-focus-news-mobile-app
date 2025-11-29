import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';

interface ParallaxHeroProps {
  imageUrl: string;
  scrollY: SharedValue<number>;
}

const HERO_HEIGHT = 300;
const PARALLAX_FACTOR = 0.5;

export function ParallaxHero({ imageUrl, scrollY }: ParallaxHeroProps) {
  const { width } = useWindowDimensions();

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [-HERO_HEIGHT * PARALLAX_FACTOR, 0, HERO_HEIGHT * PARALLAX_FACTOR],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0],
      [1.5, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={{ height: HERO_HEIGHT }} className="overflow-hidden bg-gray-200 dark:bg-neutral-800">
      <Animated.View style={[{ width, height: HERO_HEIGHT * 1.3 }, imageStyle]}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: HERO_HEIGHT * 0.5,
        }}
      />
    </View>
  );
}

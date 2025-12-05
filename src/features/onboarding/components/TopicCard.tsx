import { Pressable, View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { haptics } from '@/src/shared/utils/haptics';
import type { CategoryWithImage } from '../hooks/useCategoriesWithImages';
import { Icon } from '@/src/shared/components';

interface TopicCardProps {
  category: CategoryWithImage;
  isSelected: boolean;
  onToggle: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80';

export function TopicCard({ category, isSelected, onToggle }: TopicCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 }),
    );
    haptics.selection();
    onToggle();
  };

  const imageUrl = category.imageUrl || PLACEHOLDER_IMAGE;

  return (
    <AnimatedPressable
      className="flex-1 h-[130px] rounded-2xl overflow-hidden"
      style={animatedStyle}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="flex-1 justify-end"
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          className="flex-1 justify-end p-4"
        >
          <View>
            <Text className="text-white text-[15px] font-semibold" numberOfLines={2}>
              {category.name}
            </Text>
            {category.count && (
              <Text className="text-white/60 text-[12px] mt-0.5">{category.count} articles</Text>
            )}
          </View>
        </LinearGradient>

        {isSelected && (
          <View className="absolute top-3 right-3 bg-white rounded-full shadow-sm">
            <Icon name="checkmark-circle" size={26} color="#007AFF" />
          </View>
        )}

        {isSelected && (
          <View className="absolute inset-0 rounded-2xl border-[3px] border-accent" />
        )}
      </ImageBackground>
    </AnimatedPressable>
  );
}

import { Pressable, View, Text, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { haptics } from '@/src/shared/utils/haptics';
import type { CategoryWithImage } from '../hooks/useCategoriesWithImages';

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
      className="flex-1 m-1.5 h-[140px] rounded-xl overflow-hidden"
      style={animatedStyle}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="flex-1 justify-end"
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="flex-1 justify-end p-3"
        >
          <View className="gap-0.5">
            <Text className="text-white text-base font-bold" numberOfLines={2}>
              {category.name}
            </Text>
            {category.count && (
              <Text className="text-white/70 text-xs">{category.count} articles</Text>
            )}
          </View>
        </LinearGradient>

        {isSelected && (
          <View className="absolute top-2 right-2 bg-white rounded-full">
            <Ionicons name="checkmark-circle" size={28} color="#007AFF" />
          </View>
        )}

        {isSelected && (
          <View className="absolute inset-0 rounded-xl border-[3px] border-accent" />
        )}
      </ImageBackground>
    </AnimatedPressable>
  );
}

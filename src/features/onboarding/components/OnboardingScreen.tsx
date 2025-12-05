import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTopicsStore } from '@/src/features/topics/stores/topicsStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useCategoriesWithImages, CategoryWithImage } from '../hooks/useCategoriesWithImages';
import { TopicCard } from './TopicCard';
import { haptics } from '@/src/shared/utils/haptics';

export function OnboardingScreen() {
  const router = useRouter();
  const { categories, loading, error, refetch } = useCategoriesWithImages();
  const { followTopic } = useTopicsStore();
  const { completeOnboarding } = useOnboardingStore();

  const [selectedTopics, setSelectedTopics] = useState<Map<string, CategoryWithImage>>(new Map());

  const toggleTopic = useCallback((category: CategoryWithImage) => {
    setSelectedTopics(prev => {
      const next = new Map(prev);
      if (next.has(category.id)) {
        next.delete(category.id);
      } else {
        next.set(category.id, category);
      }
      return next;
    });
  }, []);

  const handleContinue = useCallback(() => {
    haptics.success();
    selectedTopics.forEach(cat => {
      followTopic({
        id: cat.id,
        databaseId: cat.databaseId,
        name: cat.name,
        slug: cat.slug,
      });
    });
    completeOnboarding();
    router.replace('/(tabs)');
  }, [selectedTopics, followTopic, completeOnboarding, router]);

  const handleSkip = useCallback(() => {
    haptics.light();
    completeOnboarding();
    router.replace('/(tabs)');
  }, [completeOnboarding, router]);

  const renderItem = useCallback(
    ({ item }: { item: CategoryWithImage }) => (
      <TopicCard
        category={item}
        isSelected={selectedTopics.has(item.id)}
        onToggle={() => toggleTopic(item)}
      />
    ),
    [selectedTopics, toggleTopic],
  );

  const keyExtractor = useCallback((item: CategoryWithImage) => item.id, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 justify-center items-center gap-3">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="text-base text-gray-500 dark:text-white">
            Loading topics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-base text-gray-500 dark:text-white">
            Failed to load topics
          </Text>
          <Pressable className="bg-accent px-6 py-3 rounded-lg" onPress={() => refetch()}>
            <Text className="text-white text-[15px] font-semibold">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-6 pt-8 pb-6">
        <Text className="text-[34px] font-bold text-black dark:text-white tracking-tight">
          What interests you?
        </Text>
        <Text className="text-[17px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          Choose topics to personalize your feed
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />

      <View className="px-6 pb-8 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Text className="text-[13px] text-gray-400 dark:text-gray-500 text-center mb-4 tracking-wide">
          {selectedTopics.size} topic{selectedTopics.size !== 1 ? 's' : ''} selected
        </Text>

        <Pressable
          className={`bg-accent py-[16px] rounded-[14px] items-center ${selectedTopics.size === 0 ? 'opacity-40' : ''}`}
          onPress={handleContinue}
          disabled={selectedTopics.size === 0}
          style={({ pressed }) => ({ opacity: pressed && selectedTopics.size > 0 ? 0.8 : undefined })}
        >
          <Text className="text-white text-[17px] font-semibold">Continue</Text>
        </Pressable>

        <Pressable
          className="py-4 items-center mt-2"
          onPress={handleSkip}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-gray-400 dark:text-gray-500 text-[15px] font-medium">
            Skip for now
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

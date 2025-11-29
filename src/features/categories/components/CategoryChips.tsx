import { memo } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/shared/utils/haptics';
import { useIsFollowing, useToggleFollow } from '@/src/features/topics';
import type { CategoryItem } from '../types';

interface CategoryChipsProps {
  categories: CategoryItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

interface CategoryChipProps {
  category: CategoryItem;
  isSelected: boolean;
  onSelect: () => void;
}

const CategoryChip = memo(function CategoryChip({
  category,
  isSelected,
  onSelect,
}: CategoryChipProps) {
  const isFollowing = useIsFollowing(category.id);
  const toggleFollow = useToggleFollow();

  const handleLongPress = () => {
    haptics.medium();
    toggleFollow({
      id: category.id,
      databaseId: category.databaseId,
      name: category.name,
      slug: category.slug,
    });
  };

  return (
    <Pressable
      onPress={onSelect}
      onLongPress={handleLongPress}
      className={`flex-row items-center px-4 py-2 rounded-full ${
        isSelected ? 'bg-accent' : 'bg-gray-100 dark:bg-gray-800'
      }`}>
      {isFollowing && (
        <Ionicons
          name="heart"
          size={14}
          color={isSelected ? '#fff' : '#007AFF'}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        className={
          isSelected
            ? 'text-white font-semibold'
            : 'text-gray-700 dark:text-gray-300'
        }>
        {category.name}
      </Text>
    </Pressable>
  );
});

export const CategoryChips = memo(function CategoryChips({
  categories,
  selectedId,
  onSelect,
}: CategoryChipsProps) {
  return (
    <View className="bg-white dark:bg-black py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        <Pressable
          onPress={() => {
            haptics.selection();
            onSelect(null);
          }}
          className={`px-4 py-2 rounded-full ${
            selectedId === null ? 'bg-accent' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
          <Text
            className={
              selectedId === null
                ? 'text-white font-semibold'
                : 'text-gray-700 dark:text-gray-300'
            }>
            All
          </Text>
        </Pressable>
        {categories.map(cat => (
          <CategoryChip
            key={cat.id}
            category={cat}
            isSelected={selectedId === cat.databaseId}
            onSelect={() => {
              haptics.selection();
              onSelect(cat.databaseId);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
});

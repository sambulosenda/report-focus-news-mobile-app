import { memo } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { haptics } from '@/src/shared/utils/haptics';
import type { CategoryItem } from '../types';

interface CategoryChipsProps {
  categories: CategoryItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

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
          <Pressable
            key={cat.id}
            onPress={() => {
              haptics.selection();
              onSelect(cat.databaseId);
            }}
            className={`px-4 py-2 rounded-full ${
              selectedId === cat.databaseId ? 'bg-accent' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
            <Text
              className={
                selectedId === cat.databaseId
                  ? 'text-white font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

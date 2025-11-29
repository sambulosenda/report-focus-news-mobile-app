import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/shared/utils/haptics';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search articles...',
}: SearchBarProps) {
  return (
    <View className="mx-4 mb-4 flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
      <Ionicons name="search" size={20} color="#8E8E93" style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        className="flex-1 text-base text-gray-900 dark:text-white"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            haptics.light();
            onClear();
          }}
          hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#8E8E93" />
        </Pressable>
      )}
    </View>
  );
}

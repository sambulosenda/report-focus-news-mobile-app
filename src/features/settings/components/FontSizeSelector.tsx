import { View, Text, Pressable } from 'react-native';
import { useSettingsStore, type FontSize } from '../stores/settingsStore';
import { FONT_SIZE_CONFIG, FONT_SIZE_OPTIONS } from '../constants/fontSizes';

interface FontSizeButtonProps {
  size: FontSize;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
}

function FontSizeButton({ size, isSelected, onPress, isDark }: FontSizeButtonProps) {
  const config = FONT_SIZE_CONFIG[size];
  const previewSize = {
    small: 12,
    medium: 16,
    large: 20,
    'extra-large': 24,
  }[size];

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center py-3 rounded-lg mx-1 ${
        isSelected
          ? 'bg-accent'
          : isDark
            ? 'bg-neutral-800'
            : 'bg-gray-200'
      }`}
    >
      <Text
        style={{ fontSize: previewSize }}
        className={`font-semibold ${
          isSelected ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Aa
      </Text>
      <Text
        className={`text-xs mt-1 ${
          isSelected ? 'text-white/80' : isDark ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        {config.label}
      </Text>
    </Pressable>
  );
}

interface FontSizeSelectorProps {
  isDark: boolean;
}

export function FontSizeSelector({ isDark }: FontSizeSelectorProps) {
  const { fontSize, setFontSize } = useSettingsStore();

  return (
    <View className="flex-row px-2 py-2">
      {FONT_SIZE_OPTIONS.map(size => (
        <FontSizeButton
          key={size}
          size={size}
          isSelected={fontSize === size}
          onPress={() => setFontSize(size)}
          isDark={isDark}
        />
      ))}
    </View>
  );
}

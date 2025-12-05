import { Platform } from 'react-native';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';

// Map of icon names to their SF Symbol and Ionicons equivalents
const iconMap = {
  // Navigation
  'arrow-back': { sf: 'chevron.left', ionicon: 'arrow-back' },
  'chevron-up': { sf: 'chevron.up', ionicon: 'chevron-up' },
  'chevron-down': { sf: 'chevron.down', ionicon: 'chevron-down' },
  'chevron-right': { sf: 'chevron.right', ionicon: 'chevron-forward' },

  // Actions
  'search': { sf: 'magnifyingglass', ionicon: 'search' },
  'close': { sf: 'xmark', ionicon: 'close' },
  'close-circle': { sf: 'xmark.circle.fill', ionicon: 'close-circle' },
  'share': { sf: 'square.and.arrow.up', ionicon: 'share-outline' },
  'link': { sf: 'link', ionicon: 'link-outline' },
  'checkmark-circle': { sf: 'checkmark.circle.fill', ionicon: 'checkmark-circle' },

  // Content
  'bookmark': { sf: 'bookmark', ionicon: 'bookmark-outline' },
  'bookmark-fill': { sf: 'bookmark.fill', ionicon: 'bookmark' },
  'heart': { sf: 'heart', ionicon: 'heart-outline' },
  'heart-fill': { sf: 'heart.fill', ionicon: 'heart' },
  'image': { sf: 'photo', ionicon: 'image-outline' },

  // Media
  'play': { sf: 'play.fill', ionicon: 'play' },
  'play-circle': { sf: 'play.circle', ionicon: 'play-circle-outline' },
  'videocam-off': { sf: 'video.slash', ionicon: 'videocam-off' },

  // Tabs
  'newspaper': { sf: 'newspaper', ionicon: 'newspaper-outline' },
  'settings': { sf: 'gearshape', ionicon: 'settings-outline' },

  // Settings
  'phone': { sf: 'iphone', ionicon: 'phone-portrait-outline' },
  'moon': { sf: 'moon', ionicon: 'moon-outline' },
  'moon-fill': { sf: 'moon.fill', ionicon: 'moon' },
  'text-size': { sf: 'textformat.size', ionicon: 'text-outline' },
  'info': { sf: 'info.circle', ionicon: 'information-circle-outline' },
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  weight?: SymbolViewProps['weight'];
  style?: object;
}

export function Icon({ name, size = 24, color = '#000', weight = 'medium', style }: IconProps) {
  const icons = iconMap[name];

  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={icons.sf}
        size={size}
        tintColor={color}
        weight={weight}
        style={style}
      />
    );
  }

  // Android fallback to Ionicons
  return (
    <Ionicons
      name={icons.ionicon as any}
      size={size}
      color={color}
      style={style}
    />
  );
}

import { NativeTabs, VectorIcon, Icon, Label } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/src/features/theme';

export default function TabLayout() {
  const { theme, isSystemTheme } = useThemeStore();
  const systemTheme = useColorScheme();
  const isDark = (isSystemTheme ? systemTheme : theme) === 'dark';

  return (
    <NativeTabs
      iconColor={isDark ? '#ffffff' : '#8E8E93'}
      tintColor="#007AFF"
      backgroundColor={isDark ? '#1c1c1e' : '#f2f2f7'}
      indicatorColor="#007AFF"
    >
      <NativeTabs.Trigger name="index">
        <Icon src={<VectorIcon family={Ionicons as any} name="newspaper-outline" />} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon src={<VectorIcon family={Ionicons as any} name="search-outline" />} />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bookmarks">
        <Icon src={<VectorIcon family={Ionicons as any} name="bookmark-outline" />} />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="notifications">
        <Icon src={<VectorIcon family={Ionicons as any} name="notifications-outline" />} />
        <Label>Alerts</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Icon src={<VectorIcon family={Ionicons as any} name="settings-outline" />} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

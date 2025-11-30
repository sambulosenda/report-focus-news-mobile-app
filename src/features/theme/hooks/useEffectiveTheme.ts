import { useColorScheme } from 'react-native';
import { useThemeStore } from '../stores/themeStore';

export function useEffectiveTheme() {
  const systemTheme = useColorScheme();
  const { theme, isSystemTheme } = useThemeStore();
  const effectiveTheme = isSystemTheme ? (systemTheme ?? 'light') : theme;
  const isDark = effectiveTheme === 'dark';

  return { effectiveTheme, isDark };
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'light' | 'dark';

interface ThemeState {
  theme: ColorScheme;
  isSystemTheme: boolean;
  setTheme: (theme: ColorScheme) => void;
  toggleTheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'light',
      isSystemTheme: true,
      setTheme: theme => set({ theme, isSystemTheme: false }),
      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
          isSystemTheme: false,
        })),
      setSystemTheme: useSystem => set({ isSystemTheme: useSystem }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GraphQLProvider } from '@/src/graphql/client';
import { useThemeStore } from '@/src/features/theme';
import { useNotifications } from '@/src/features/notifications';

export default function RootLayout() {
  const { theme, isSystemTheme } = useThemeStore();
  const systemTheme = useColorScheme();
  const activeTheme = isSystemTheme ? systemTheme : theme;
  const { initialize } = useNotifications();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GraphQLProvider>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="article/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
      </Stack>
    </GraphQLProvider>
  );
}

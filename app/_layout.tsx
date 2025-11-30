import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GraphQLProvider } from '@/src/graphql/client';
import { useThemeStore } from '@/src/features/theme';
import { useOnboardingStore } from '@/src/features/onboarding';

export default function RootLayout() {
  const { theme, isSystemTheme } = useThemeStore();
  const { hasCompletedOnboarding, resetOnboarding } = useOnboardingStore();
  const systemTheme = useColorScheme();
  const activeTheme = isSystemTheme ? systemTheme : theme;

  // Reset onboarding on app start in dev mode - remove when done
  useEffect(() => {
    if (__DEV__) {
      resetOnboarding();
    }
  }, [resetOnboarding]);

  return (
    <GraphQLProvider>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="onboarding"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
          redirect={hasCompletedOnboarding}
        />
        <Stack.Screen name="(tabs)" redirect={!hasCompletedOnboarding} />
        <Stack.Screen
          name="article/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="video/[id]"
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

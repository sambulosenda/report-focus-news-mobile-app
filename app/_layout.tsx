import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GraphQLProvider } from '../src/graphql/client';
import { useThemeStore } from '../src/stores/themeStore';

export default function RootLayout() {
  const { theme, isSystemTheme } = useThemeStore();
  const systemTheme = useColorScheme();
  const activeTheme = isSystemTheme ? systemTheme : theme;

  return (
    <GraphQLProvider>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="article/[id]"
          options={{
            presentation: 'card',
          }}
        />
      </Stack>
    </GraphQLProvider>
  );
}

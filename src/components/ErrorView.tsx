import { View, Text, Pressable } from 'react-native';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = 'Something went wrong',
  onRetry
}: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Oops!
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center mb-4">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-accent px-6 py-3 rounded-lg active:opacity-80"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

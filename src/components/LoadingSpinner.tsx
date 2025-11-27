import { ActivityIndicator, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center py-8">
      <ActivityIndicator size={size} color="#007AFF" />
    </View>
  );
}

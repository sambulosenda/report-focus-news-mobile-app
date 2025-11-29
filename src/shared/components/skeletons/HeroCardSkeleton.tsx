import { View } from 'react-native';
import { Skeleton } from './Skeleton';

export function HeroCardSkeleton() {
  return (
    <View className="mx-4 mb-4">
      <View className="h-72 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 justify-end p-4">
        <Skeleton width={80} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={24} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="70%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={140} height={14} borderRadius={4} />
      </View>
    </View>
  );
}

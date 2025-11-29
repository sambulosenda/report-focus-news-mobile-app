import { View } from 'react-native';
import { Skeleton } from './Skeleton';

export function SearchResultSkeleton() {
  return (
    <View className="flex-row mx-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <Skeleton width={64} height={64} borderRadius={8} style={{ marginRight: 12 }} />
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Skeleton width={50} height={12} borderRadius={4} style={{ marginRight: 8 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="60%" height={12} borderRadius={4} />
      </View>
    </View>
  );
}

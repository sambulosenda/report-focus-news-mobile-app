import { View } from 'react-native';
import { Skeleton } from './Skeleton';

export function ArticleCardSkeleton() {
  return (
    <View className="flex-row mx-4 mb-3 p-3 bg-white dark:bg-gray-900 rounded-xl">
      <View className="flex-1 pr-3">
        <Skeleton width={60} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={18} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="60%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={100} height={12} borderRadius={4} />
      </View>
      <Skeleton width={96} height={96} borderRadius={8} />
    </View>
  );
}

import { router } from 'expo-router';

export const Routes = {
  home: '/(tabs)' as const,
  search: '/(tabs)/search' as const,
  settings: '/(tabs)/settings' as const,
  articleDetail: (id: number) => `/article/${id}` as const,
} as const;

export const navigationService = {
  goToArticle: (id: number) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: id.toString() },
    });
  },
  goHome: () => router.push(Routes.home),
  goToSearch: () => router.push(Routes.search),
  goToSettings: () => router.push(Routes.settings),
  goBack: () => router.back(),
};

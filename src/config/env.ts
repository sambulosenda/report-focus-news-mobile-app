export const config = {
  api: {
    graphql: {
      uri: process.env.EXPO_PUBLIC_GRAPHQL_URI || 'https://backend.reportfocusnews.com/graphql',
      timeout: 30000,
    },
  },
  app: {
    name: 'Report Focus',
    version: '1.0.0',
  },
  pagination: {
    defaultPageSize: 15,
    searchPageSize: 20,
  },
} as const;

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { RetryLink } from '@apollo/client/link/retry';
import { ReactNode } from 'react';
import { config } from '../config/env';

const errorLink = new ErrorLink(({ error }) => {
  if (__DEV__) {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message }) => {
        console.error(`[GraphQL error]: ${message}`);
      });
    } else {
      console.error(`[Network error]: ${error}`);
    }
  }
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: error => !!error,
  },
});

const httpLink = new HttpLink({
  uri: config.api.graphql.uri,
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: ['where'],
          merge(existing, incoming, { args }) {
            if (!args?.after) return incoming;
            if (!incoming?.nodes) return incoming;
            const existingNodes = existing?.nodes || [];
            const existingIds = new Set(existingNodes.map((n: { __ref: string }) => n.__ref));
            const newNodes = incoming.nodes.filter((n: { __ref: string }) => !existingIds.has(n.__ref));
            return {
              ...incoming,
              nodes: [...existingNodes, ...newNodes],
            };
          },
        },
        categories: {
          keyArgs: false,
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export const GraphQLProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

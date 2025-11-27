import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { RetryLink } from '@apollo/client/link/retry';
import { ReactNode } from 'react';

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  } else {
    console.error(`[Network error]: ${error}`);
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
  uri: 'https://backend.reportfocusnews.com/graphql',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: ['where'],
          merge(existing, incoming, { args }) {
            if (!args?.after) return incoming;
            return {
              ...incoming,
              nodes: [...(existing?.nodes || []), ...incoming.nodes],
            };
          },
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

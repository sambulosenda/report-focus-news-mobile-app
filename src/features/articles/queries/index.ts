import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            id
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      title
      content
      excerpt
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      author {
        node {
          id
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($first: Int!) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!, $first: Int!) {
    posts(first: $first, where: { search: $search }) {
      nodes {
        id
        databaseId
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_TRENDING_POSTS = gql`
  query GetTrendingPosts($first: Int!, $notIn: [ID]) {
    posts(
      first: $first
      where: { orderby: { field: DATE, order: DESC }, notIn: $notIn }
    ) {
      nodes {
        id
        databaseId
        title
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($categoryIn: [ID!], $notIn: [ID], $first: Int!) {
    posts(first: $first, where: { categoryIn: $categoryIn, notIn: $notIn }) {
      nodes {
        id
        databaseId
        title
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

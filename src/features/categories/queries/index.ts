import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories($first: Int) {
    categories(first: $first, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categoryId: Int!, $first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { categoryId: $categoryId }) {
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

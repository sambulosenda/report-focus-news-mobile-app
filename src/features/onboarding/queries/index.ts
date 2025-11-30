import { gql } from '@apollo/client';

export const GET_CATEGORIES_WITH_IMAGES = gql`
  query GetCategoriesWithImages($first: Int) {
    categories(first: $first, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
        posts(first: 1) {
          nodes {
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

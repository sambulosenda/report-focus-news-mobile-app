import { gql } from '@apollo/client';

export const GET_VIDEO_POSTS = gql`
  query GetVideoPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: "Videos" }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        content
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

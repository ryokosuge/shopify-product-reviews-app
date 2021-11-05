import gql from "graphql-tag";

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($query: String) {
    products(first: 100, query: $query) {
      edges {
        node {
          id
          title
          featuredImage {
            id
            originalSrc
          }
        }
      }
    }
  }
`;

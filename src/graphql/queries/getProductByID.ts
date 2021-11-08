import gql from "graphql-tag";

export const GET_PRODUCT_BY_ID = gql`
  query GetProductByID($productID: ID!) {
    product(id: $productID) {
      id
      title
      featuredImage {
        id
        originalSrc
      }
    }
  }
`;

import gql from "graphql-tag";

export const GET_PRODUCT_METAFIELDS_QUERY = gql`
  query GetProductMetafields($productId: ID!, $namespace: String!) {
    product(id: $productId) {
      id
      metafields(namespace: $namespace, first: 100) {
        edges {
          node {
            id
            key
            value
            type
          }
        }
      }
    }
  }
`;

import gql from "graphql-tag";
import { METAFIELD_KEY } from "../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../constants/metafield_namespace";

const hoge = METAFIELD_KEY;

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
          avgRatingMetafield: metafield(
            namespace: "${METAFIELD_NAMESPACE.GENERAL}",
            key: "${METAFIELD_KEY.AVG_RATING}"
          ) {
            id
            value
          }
          publicReviews: metafields(
            first: 1,
            namespace: "${METAFIELD_NAMESPACE.PUBLIC_REVIEWS}"
          ) {
            edges {
              node {
                id
              }
            }
          }
          privateReviews: metafields(
            first: 1,
            namespace: "${METAFIELD_NAMESPACE.PRIVATE_REVIEWS}"
          ) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

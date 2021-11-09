import gql from "graphql-tag";
import { METAFIELD_KEY } from "../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../constants/metafield_namespace";

export const GET_PRODUCT_BY_ID = gql`
  query GetProductByID($productID: ID!) {
    product(id: $productID) {
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
    }
  }
`;

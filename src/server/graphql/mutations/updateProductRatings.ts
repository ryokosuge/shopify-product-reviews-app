import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_KEY } from "../../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";
import { ProductRatings } from "../../../types/review";

const PRIVATE_METAFIELD_UPSERT = (
  productGid: string,
  ratings: ProductRatings,
) => `
mutation privateMetafieldUpsert {
  privateMetafieldUpsert(input: {
    owner: "${productGid}",
    key: "${METAFIELD_KEY.RATINGS}",
    namespace: "${METAFIELD_NAMESPACE.GENERAL}",
    valueInput: {
      value: ${JSON.stringify(JSON.stringify(ratings))},
      valueType: JSON_STRING
    }
  }) {
    privateMetafield {
      id
      key
      value
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const updateProductRatings = async (
  client: GraphqlClient,
  productGID: string,
  ratings: ProductRatings,
) => {
  await client.query({
    data: PRIVATE_METAFIELD_UPSERT(productGID, ratings),
  });
};

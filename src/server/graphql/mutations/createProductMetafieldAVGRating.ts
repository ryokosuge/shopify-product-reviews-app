import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_KEY } from "../../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";

const CREATE_PRODUCT_METAFIELD_AVG_RATING = (
  productID: string,
  avgRating: number,
) => `
mutation ProductMetafieldCreate {
  productUpdate(input: {
    id: "${productID}"
    metafields: [
      {
        namespace: "${METAFIELD_NAMESPACE.GENERAL}",
        key: "${METAFIELD_KEY.AVG_RATING}",
        value: "${String(avgRating)}",
        valueType: STRING
      }
    ]
  }) {
    userErrors {
      field
      message
    }
  }
}
`;

export const createProductMetafieldAvgRating = async (
  client: GraphqlClient,
  productID: string,
  avgRating: number,
) => {
  await client.query({
    data: CREATE_PRODUCT_METAFIELD_AVG_RATING(productID, avgRating),
  });
};

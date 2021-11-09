import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_KEY } from "../../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";
import { createProductMetafieldAvgRating } from "./createProductMetafieldAVGRating";
import { deleteMetafield } from "./deleteMetafield";

const GET_PRODUCT_AVG_RATING_METAFIELD = (productID: string) => `
{
  product(id: "${productID}") {
    avgRatingMetafield: metafield(
      namespace: "${METAFIELD_NAMESPACE.GENERAL}",
      key: "${METAFIELD_KEY.AVG_RATING}"
    ) {
      id
      key
      namespace
      type
      value
    }
  }
}
`;

export const updateProductAVGRating = async (
  client: GraphqlClient,
  productGID: string,
  avgRating: number,
) => {
  console.log(GET_PRODUCT_AVG_RATING_METAFIELD(productGID));
  const {
    body: {
      data: {
        product: { avgRatingMetafield },
      },
    },
  } = (await client.query({
    data: GET_PRODUCT_AVG_RATING_METAFIELD(productGID),
  })) as {
    body: {
      data: {
        product: {
          avgRatingMetafield?: {
            id: string;
            key: string;
            namespace: string;
            type: "json";
            value: string;
          };
        };
      };
    };
  };

  if (avgRatingMetafield != null) {
    const ogMetafieldID = avgRatingMetafield.id;
    await deleteMetafield(client, ogMetafieldID);
  }

  await createProductMetafieldAvgRating(client, productGID, avgRating);
};

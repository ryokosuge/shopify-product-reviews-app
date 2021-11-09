import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_KEY } from "../../../constants/metafield_key";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";
import { GraphQLResponse } from "../../../types/graphql-api";
import { ProductRatings } from "../../../types/review";

const GET_PRODUCT_RATINGS = (productID: string) => `
{
  product(id: "${productID}") {
    id
    ratings:privateMetafield(namespace: "${METAFIELD_NAMESPACE.GENERAL}", key: "${METAFIELD_KEY.RATINGS}") {
      id
      key
      namespace
      value
      valueType
    }
  }
}
`;

const DEFAULT_PRODUCT_RATINGS: ProductRatings = {
  1: { weight: 1, total: 0 },
  2: { weight: 2, total: 0 },
  3: { weight: 3, total: 0 },
  4: { weight: 4, total: 0 },
  5: { weight: 5, total: 0 },
};

export const getProductRatings = async (
  client: GraphqlClient,
  productID: string,
) => {
  const {
    body: { data },
  } = (await client.query({
    data: GET_PRODUCT_RATINGS(productID),
  })) as GraphQLResponse<
    "product",
    {
      ratings?: {
        id: string;
        key: string;
        namespace: string;
        value: string;
        type: "json";
      };
    }
  >;
  if (data.product.ratings == null) {
    return DEFAULT_PRODUCT_RATINGS;
  }

  return JSON.parse(data.product.ratings.value) as ProductRatings;
};

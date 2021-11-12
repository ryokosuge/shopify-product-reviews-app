import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";
import { ReviewMetafield } from "../../../types/review";

const CREATE_PRODUCT_METAFIELD_PRIVATE_REVIEW = (
  productID: string,
  review: ReviewMetafield,
) => `
mutation ProductMetafieldCreate {
  productUpdate(input: {
    id: "${productID}"
    metafields: [
      {
        namespace: "${METAFIELD_NAMESPACE.PRIVATE_REVIEWS}",
        key: "${review.id}",
        value: ${JSON.stringify(JSON.stringify(review))},
        type: "json"
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

export const createProductMetafieldPrivateReview = async (
  client: GraphqlClient,
  productID: string,
  review: ReviewMetafield,
) => {
  console.log(CREATE_PRODUCT_METAFIELD_PRIVATE_REVIEW(productID, review));
  const respose = await client.query({
    data: CREATE_PRODUCT_METAFIELD_PRIVATE_REVIEW(productID, review),
  });
  console.log(JSON.stringify(respose, null, 2));
};

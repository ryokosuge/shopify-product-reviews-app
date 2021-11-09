import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { METAFIELD_NAMESPACE } from "../../../constants/metafield_namespace";
import {
  GraphQLResponse,
  ProductWithReviewMetafields,
} from "../../../types/graphql-api";
import {
  ProductQueueMessage,
  ReviewMessageSnapshot,
} from "../../../types/review";

const GET_PRODUCT_QUEUE_MESSAGES = (productID: string) => `
{
  product (id: "${productID}") {
    id
    metafields (namespace: "${METAFIELD_NAMESPACE.MESSAGES}", reverse: true, first: 10) {
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

export const getProductQueueMessages = async (
  client: GraphqlClient,
  productID: string,
) => {
  const {
    body: { data },
  } = (await client.query({
    data: GET_PRODUCT_QUEUE_MESSAGES(productID),
  })) as GraphQLResponse<"product", ProductWithReviewMetafields>;

  return (data.product.metafields?.edges.map(({ node }) => ({
    ...node,
    value: JSON.parse(node.value) as ReviewMessageSnapshot,
  })) ?? []) as ProductQueueMessage[];
};

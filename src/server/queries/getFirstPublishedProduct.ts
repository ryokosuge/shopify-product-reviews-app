import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { GraphQLResponseEdges } from "../../types/graphql_api";

export const GET_FIRST_PUBLISHED_PRODUCT_QUERY = `
{
  products(first: 1, query: "published_status:published") {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}
`;

export const getFirstPublishedProduct = async (
  graphQLClient: GraphqlClient,
) => {
  const { body } = (await graphQLClient.query({
    data: GET_FIRST_PUBLISHED_PRODUCT_QUERY,
  })) as GraphQLResponseEdges<"products">;
  console.log(JSON.stringify(body, null, 2));
  return body.data.products.edges[0].node;
};

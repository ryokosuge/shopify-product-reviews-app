import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";

const METAFIELD_DELETE = (metafieldID: string) => `
mutation MetafieldDelete {
  metafieldDelete(input: {
    id: "${metafieldID}"
  }) {
    deletedId
    userErrors {
      field
      message
    }
  }
}
`;

export const deleteMetafield = async (client: GraphqlClient, id: string) => {
  await client.query({
    data: METAFIELD_DELETE(id),
  });
};

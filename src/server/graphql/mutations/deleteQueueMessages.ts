import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { ProductQueueMessage } from "../../../types/review";
import { deleteMetafield } from "./deleteMetafield";

const deleteQueueMessage = (
  client: GraphqlClient,
  message: ProductQueueMessage,
) => {
  return deleteMetafield(client, message.id);
};

export const deleteQueueMessages = (
  client: GraphqlClient,
  messages: ProductQueueMessage[],
) => {
  return Promise.all(
    messages.map((message) => deleteQueueMessage(client, message)),
  );
};

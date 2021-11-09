import { nanoid } from "nanoid";
import React from "react";
import { MESSAGE_TYPE } from "../constants/message_type";
import { METAFIELD_NAMESPACE } from "../constants/metafield_namespace";
import { MetaField, MetaFieldType } from "../types/graphql-api";
import { useProductMetafieldCreate } from "./useProductMetafieldCreate";
import { ProductReviewMetaField } from "./useProductReviews";

type ProduceProductMessageProps<T extends keyof MetaFieldType> = {
  productId: string;
  metafield: ProductReviewMetaField;
};

export const useProduceProductMessage = () => {
  const createProductMetafield = useProductMetafieldCreate();

  const produceProductMessage = React.useCallback(
    async (
      type: string,
      { productId, metafield }: ProduceProductMessageProps<"json">,
    ) => {
      return createProductMetafield({
        productId,
        metafield: {
          namespace: METAFIELD_NAMESPACE.MESSAGES,
          key: nanoid(),
          value: JSON.stringify({
            type,
            data: { review_snapshot: metafield.value },
          }),
          type: "json",
        },
      });
    },
    [createProductMetafield],
  );

  const produceReviewPublishedMessage = React.useMemo(
    () => produceProductMessage.bind(null, MESSAGE_TYPE.REVIEW_PUBLISHED),
    [produceProductMessage],
  );

  const produceReviewUnpublishedMessage = React.useMemo(
    () => produceProductMessage.bind(null, MESSAGE_TYPE.REVIEW_UNPUBLISHED),
    [produceProductMessage],
  );

  const produceReviewDeletedMessage = React.useMemo(
    () => produceProductMessage.bind(null, MESSAGE_TYPE.REVIEW_DELETED),
    [produceProductMessage],
  );

  return {
    produceReviewPublishedMessage,
    produceReviewUnpublishedMessage,
    produceReviewDeletedMessage,
  };
};

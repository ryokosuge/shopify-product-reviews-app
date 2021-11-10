import React from "react";
import { METAFIELD_NAMESPACE } from "../constants/metafield_namespace";
import { ReviewState } from "../types/review";
import { useMetafieldDelete } from "./useMetafieldDelete";
import { useProduceProductMessage } from "./useProduceProductMessage";
import { useProductMetafieldUpdate } from "./useProductMetafieldUpdate";
import { ProductReviewMetaField } from "./useProductReviews";

export const useDeleteReviews = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const deleteMetafield = useMetafieldDelete();
  const { produceReviewDeletedMessage } = useProduceProductMessage();

  const deleteReview = React.useCallback(
    async ({
      productId,
      review,
    }: {
      productId: string;
      review: ProductReviewMetaField;
    }) => {
      await produceReviewDeletedMessage({ productId, metafield: review });
      await deleteMetafield({ id: review.id });
    },
    [produceReviewDeletedMessage, deleteMetafield],
  );

  const deleteAll = React.useCallback(
    async ({
      productId,
      reviews,
    }: {
      productId: string;
      reviews: ProductReviewMetaField[];
    }) => {
      setLoading(true);
      try {
        await Promise.all(
          reviews.map((review) => deleteReview({ productId, review })),
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [deleteReview],
  );

  return { deleteAll, loading };
};

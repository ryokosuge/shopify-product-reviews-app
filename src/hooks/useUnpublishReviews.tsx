import React from "react";
import { METAFIELD_NAMESPACE } from "../constants/metafield_namespace";
import { ReviewState } from "../types/review";
import { useProductMetafieldUpdate } from "./useProductMetafieldUpdate";
import { ProductReviewMetaField } from "./useProductReviews";

export const useUnpublishReviews = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const updateProductMetafield = useProductMetafieldUpdate();

  const unpublishReview = React.useCallback(
    async ({
      productId,
      review,
    }: {
      productId: string;
      review: ProductReviewMetaField;
    }) => {
      await updateProductMetafield({
        productId,
        ogMetafieldId: review.id,
        metafield: {
          key: review.key,
          namespace: METAFIELD_NAMESPACE.PRIVATE_REVIEWS,
          type: "json",
          value: JSON.stringify({
            ...review.value,
            state: ReviewState.Unpublished,
          }),
        },
      });
    },
    [updateProductMetafield],
  );

  const unpublishAll = React.useCallback(
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
          reviews.map((review) => unpublishReview({ productId, review })),
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [unpublishReview],
  );

  return { unpublishAll, loading };
};

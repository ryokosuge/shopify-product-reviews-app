import { useQuery } from "@apollo/client";
import React from "react";
import { METAFIELD_NAMESPACE } from "../constants/metafield_namespace";
import { GET_PRODUCT_METAFIELDS_QUERY } from "../graphql/queries/getProductMetafields";
import { ProductWithReviewMetafields } from "../types/graphql_api";
import { ReviewMetafield, ReviewState, ReviewStateType } from "../types/review";

export type ProductReviewMetaField = Omit<
  ProductWithReviewMetafields["metafields"]["edges"][number]["node"],
  "value"
> & {
  value: ReviewMetafield;
};

export const useProductReviews = ({
  productId,
  state,
}: {
  productId: string;
  state: ReviewStateType;
}) => {
  const namespace =
    state === ReviewState.Unpublished
      ? METAFIELD_NAMESPACE.PRIVATE_REVIEWS
      : METAFIELD_NAMESPACE.PUBLIC_REVIEWS;

  const { data, loading, refetch } = useQuery<{
    product: ProductWithReviewMetafields;
  }>(GET_PRODUCT_METAFIELDS_QUERY, {
    variables: {
      productId,
      namespace,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const reviews: ProductReviewMetaField[] =
    data == null
      ? []
      : data.product.metafields.edges.map((metafield) => ({
          ...metafield.node,
          value: JSON.parse(metafield.node.value) as ReviewMetafield,
        }));
  return { reviews, loading, refetch };
};

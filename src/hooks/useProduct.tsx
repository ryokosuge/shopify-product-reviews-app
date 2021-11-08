import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../graphql/queries/getProductByID";
import { ProductWithReviewAndMetafield } from "../types/graphql_api";

export const useProduct = (productID: string) => {
  const { data, loading, error } = useQuery<{
    product: ProductWithReviewAndMetafield;
  }>(GET_PRODUCT_BY_ID, {
    variables: { productID },
    fetchPolicy: "network-only",
  });

  return React.useMemo(
    () => ({ product: data?.product, loading, error }),
    [data?.product, error, loading],
  );
};

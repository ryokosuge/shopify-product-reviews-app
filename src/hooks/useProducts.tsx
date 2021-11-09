import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_QUERY } from "../graphql/queries/getProducts";
import { ProductWithReviewAndMetafield } from "../types/graphql-api";

export const useProducts = ({ query = "" }: { query: string }) => {
  const { data, loading } = useQuery<{
    products: { edges: { node: ProductWithReviewAndMetafield }[] };
  }>(GET_PRODUCTS_QUERY, {
    variables: { query },
    fetchPolicy: "network-only",
  });

  console.log(`data:  ${JSON.stringify(data)}`);

  const products = React.useMemo(() => {
    if (data == null) {
      return [];
    }

    return data.products.edges
      .map((edge) => ({
        ...edge.node,
        avgRating: edge.node.avgRatingMetafield?.value,
        hasReviews: Boolean(
          [...edge.node.publicReviews.edges, ...edge.node.privateReviews.edges]
            .length,
        ),
      }))
      .filter((edge) => edge.hasReviews);
  }, [data]);

  console.log(JSON.stringify(products));

  return React.useMemo(() => ({ products, loading }), [loading, products]);
};

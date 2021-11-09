import { useMutation } from "@apollo/client";
import React from "react";
import { PROUDCT_METAFIELD_CREATE } from "../graphql/mutations/productMetafieldCreate";
import { MetaField, MetaFieldType } from "../types/graphql-api";

type ProductMetafieldCreateProps<T extends keyof MetaFieldType> = {
  productId: string;
  metafield: Omit<MetaField<T>, "id">;
};

export const useProductMetafieldCreate = () => {
  const [mutation] = useMutation(PROUDCT_METAFIELD_CREATE);
  return React.useCallback(
    async ({ productId, metafield }: ProductMetafieldCreateProps<"json">) => {
      const mutationResult = await mutation({
        variables: {
          input: {
            id: productId,
            metafields: [metafield],
          },
        },
      });
      return mutationResult;
    },
    [mutation],
  );
};

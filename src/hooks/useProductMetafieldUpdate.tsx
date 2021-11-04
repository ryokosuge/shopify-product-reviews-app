import React from "react";
import { MetaField, MetaFieldType } from "../types/graphql_api";
import { useMetafieldDelete } from "./useMetafieldDelete";
import { useProductMetafieldCreate } from "./useProductMetafieldCreate";

type ProductMetafieldUpdateProps<T extends keyof MetaFieldType> = {
  productId: string;
  ogMetafieldId: string;
  metafield: MetaField<T>;
};

export const useProductMetafieldUpdate = () => {
  const deleteMetafield = useMetafieldDelete();
  const createProductMetafield = useProductMetafieldCreate();

  return React.useCallback(
    async ({
      productId,
      ogMetafieldId,
      metafield,
    }: ProductMetafieldUpdateProps<"json">) => {
      await deleteMetafield({ id: ogMetafieldId });
      await createProductMetafield({ productId, metafield });
    },
    [createProductMetafield, deleteMetafield],
  );
};

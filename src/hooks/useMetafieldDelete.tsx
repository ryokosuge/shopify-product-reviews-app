import { useMutation } from "@apollo/client";
import React from "react";
import { METAFIELD_DELETE } from "../graphql/mutations/metafieldDelete";

export const useMetafieldDelete = () => {
  const [mutation] = useMutation(METAFIELD_DELETE);
  return React.useCallback(
    async ({ id }: { id: string }) => {
      const mutationResult = await mutation({
        variables: { input: { id } },
      });
      return mutationResult;
    },
    [mutation],
  );
};

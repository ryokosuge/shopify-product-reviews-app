import { nanoid } from "nanoid";
import { METAFIELD_NAMESPACE } from "../constants/metafield_namespace";
import { MetaField } from "../types/graphql_api";
import { ReviewFormType, ReviewState } from "../types/review";

export const generateReviewMetaFieldValue = (
  data: ReviewFormType,
): MetaField<"json"> => {
  const id = nanoid(30);
  return {
    key: id,
    namespace: METAFIELD_NAMESPACE.PRIVATE_REVIEWS,
    type: "json",
    value: JSON.stringify({
      id,
      ...data,
      created_at: new Date().toISOString(),
      state: ReviewState.Unpublished,
    }),
  };
};

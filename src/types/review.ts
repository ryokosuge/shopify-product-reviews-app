import { MESSAGE_TYPE } from "../constants/message_type";
import { ProductWithReviewMetafieldEdgeNode } from "./graphql-api";

export type ReviewFormType = {
  name: string;
  email: string;
  rating: string;
  reviewTitle: string;
  reviewBody: string;
};

export const ReviewState = {
  Published: "published",
  Unpublished: "unpublished",
} as const;

export type ReviewStateType = typeof ReviewState[keyof typeof ReviewState];

export type ReviewMetafield = ReviewFormType & {
  id: string;
  state: ReviewStateType;
  created_at: string;
};

export type ReviewMessageSnapshot = {
  type: typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];
  data: {
    review_snapshot: ReviewMetafield;
  };
};

export type ProductQueueMessage = Omit<
  ProductWithReviewMetafieldEdgeNode,
  "value"
> & {
  value: ReviewMessageSnapshot;
};

export type ProductRating = {
  weight: number;
  total: number;
};

export type ProductRatings = {
  [K in 1 | 2 | 3 | 4 | 5]: ProductRating;
};

export const convertProductRatingsToJSONString = (
  ratings: ProductRatings,
) => {};

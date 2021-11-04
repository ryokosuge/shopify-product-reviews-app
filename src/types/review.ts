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

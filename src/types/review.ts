export type ReviewFormType = {
  name: string;
  email: string;
  rating: string;
  reviewTitle: string;
  reviewBody: string;
};

export const ReviewState = {
  Unpublished: "unpublished",
} as const;

export type ReviewStateType = typeof ReviewState[keyof typeof ReviewState];

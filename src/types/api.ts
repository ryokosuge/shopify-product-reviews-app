import { Theme } from "./rest-api";

export type StoreThemesMainRespose = {
  theme: Theme;
  supportsSection: boolean;
  supportsAppBlocks: boolean;
  containsAverageRatingAppBlock: boolean;
  containsProductReviewsAppBlock: boolean;
  editorUrl: string;
};

import { Theme } from "./rest_api";

export type StoreThemesMainRespose = {
  theme: Theme;
  supportsSection: boolean;
  supportsAppBlocks: boolean;
  containsAverageRatingAppBlock: boolean;
  containsProductReviewsAppBlock: boolean;
  editorUrl: string;
};

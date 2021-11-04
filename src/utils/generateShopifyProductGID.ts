import { generateShopifyGID } from "./generateShopifyGID";

export const generateShopifyProductGID = (id: string) => {
  return generateShopifyGID("Product", id);
};

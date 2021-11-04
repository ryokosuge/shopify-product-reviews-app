export type EntityType = "Product";

export const generateShopifyGID = (entityType: EntityType, id: string) => {
  return `gid://shopify/${entityType}/${id}`;
};

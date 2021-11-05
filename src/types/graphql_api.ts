export type GraphQLResponse<P extends string, T extends {}> = {
  body: {
    data: {
      [K in P]: T;
    };
  };
};

export type GraphQLResponseEdges<T extends keyof GraphQLEdgeEndpoints> = {
  body: {
    data: {
      [K in T]: {
        edges: {
          node: GraphQLEdgeEndpoints[T];
        }[];
      };
    };
  };
};

type GraphQLEdgeEndpoints = {
  products: Product;
};

export type ProductWithReviewMetafields = {
  id: string;
  metafields?: {
    edges: {
      node: ProductWithReviewMetafieldEdgeNode;
    }[];
  };
};

export type ProductWithReviewMetafieldEdgeNode = {
  id: string;
  key: string;
  value: string;
  type: keyof MetaFieldType;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
};

export type ProductWithReviewAndMetafield = {
  id: string;
  title: string;
  featuredImage?: {
    id: string;
    originalSrc: string;
  };
};

export type MetaField<T extends keyof MetaFieldType> = {
  key: string;
  namespace: string;
  type: T;
  value: MetaFieldType[T];
};

export type MetaFieldType = {
  json: string;
};

export type UserError = {
  field: string;
  message: string;
};

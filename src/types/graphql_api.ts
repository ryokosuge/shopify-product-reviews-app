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
  metafields: {
    edges: {
      node: {
        id: string;
        key: string;
        value: string;
        type: keyof MetaFieldType;
      };
    }[];
  };
};

export type Product = {
  id: string;
  title: string;
  handle: string;
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

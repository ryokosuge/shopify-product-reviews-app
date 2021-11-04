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

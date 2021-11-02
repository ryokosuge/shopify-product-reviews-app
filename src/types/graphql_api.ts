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

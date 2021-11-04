import gql from "graphql-tag";

export const PROUDCT_METAFIELD_CREATE = gql`
  mutation ProductMetafieldCreate($input: ProductInput!) {
    productUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createGraphQLClient = (shop: string, accessToken?: string) => {
  return new ApolloClient({
    uri: `https://${shop}/admin/api/2021-10/graphql.json`,
    cache: new InMemoryCache(),
    headers: {
      "X-Shopify-AccessToken": accessToken ?? "",
      "User-Agent": `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`,
    },
  });
};

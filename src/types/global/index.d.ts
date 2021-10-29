/// <reference types="node" />

declare var SHOPIFY_API_KEY: string;

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SHOPIFY_API_KEY: string;
    PORT: string;
    SHOPIFY_API_KEY: string;
    SHOPIFY_API_SECRET: string;
    SHOP: string;
    SCOPES: string;
    HOST: string;
  }
}

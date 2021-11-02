/// <reference types="node" />

declare var SHOPIFY_API_KEY: string;

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    SHOPIFY_API_KEY: string;
    SHOPIFY_API_SECRET: string;
    SHOP: string;
    SCOPES: string;
    HOST: string;
    npm_package_version: string;
    THEME_APP_EXTENSION_UUID: string;
  }
}

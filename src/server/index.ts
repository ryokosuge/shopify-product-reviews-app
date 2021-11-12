import next from "next";
import dotenv from "dotenv";
import Koa, { ExtendableContext } from "koa";
import KoaRouter from "koa-router";
import KoaBody from "koa-bodyparser";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import { RESTAPIResponse } from "../types/rest-api";
import { APP_BLOCK_TEMPLATES } from "./consts";
import { getFirstPublishedProduct } from "./graphql/queries/getFirstPublishedProduct";
import { containsAppBlock } from "../lib/contains-app-blocks";
import { enqueueProductUpdateOperation } from "./jobs/product-update";
import { AuthScopes } from "@shopify/shopify-api/dist/auth/scopes";
import { addReview } from "./jobs/add-review";
import { InMemorySessionStorag } from "./session/InMemoerySessionStorage";
import { verifyAppProxyExtensionSignatureMiddleware } from "./middlewares/verifyAppProxyExtensionSignatureMiddleware";

dotenv.config();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST, PORT } = process.env;
const port = parseInt(PORT, 10) || 8081;

// Next.js
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({
  dev,
});
const nextAppHandle = nextApp.getRequestHandler();

// Shopify
Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: new AuthScopes(SCOPES.split(",")),
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October21,
  IS_EMBEDDED_APP: true,
  IS_PRIVATE_APP: false,
  SESSION_STORAGE: new InMemorySessionStorag(),
});

const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string } = {};
const verifyIfActiveShopifyShop = (context: Koa.Context, next: Koa.Next) => {
  const shop = context.query.shop as string;
  if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
    context.redirect(`/offline/auth?shop=${shop}`);
    return;
  }

  return next();
};

const handleRequest = async (context: ExtendableContext) => {
  await nextAppHandle(context.req, context.res);
  context.respond = false;
  context.res.statusCode = 200;
};

(async () => {
  try {
    await nextApp.prepare();
    const server = new Koa();
    server.keys = [Shopify.Context.API_SECRET_KEY];

    server.use(
      createShopifyAuth({
        accessMode: "online",
        prefix: "/online",
        afterAuth: async (ctx) => {
          const { shop } = ctx.state.shopify;
          const host = ctx.query.host as string;

          ctx.redirect(
            `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}?shop=${shop}&host=${host}`,
          );
        },
      }),
    );

    server.use(
      createShopifyAuth({
        accessMode: "offline",
        prefix: "/offline",
        afterAuth: async (context) => {
          const { shop, scope, accessToken } = context.state.shopify;
          ACTIVE_SHOPIFY_SHOPS[shop] = scope;

          let webhookRes = await Shopify.Webhooks.Registry.register({
            shop: shop,
            accessToken: accessToken,
            path: "/webhooks",
            topic: "APP_UNINSTALLED",
            webhookHandler: async (topic, shop, body) => {
              delete ACTIVE_SHOPIFY_SHOPS[shop];
            },
          });

          if (!webhookRes.success) {
            console.error(
              `Failed to register APP_UNINSTALLED webhook:  ${webhookRes.result}`,
            );
          }

          webhookRes = await Shopify.Webhooks.Registry.register({
            shop,
            accessToken,
            path: "/webhooks",
            topic: "PRODUCTS_UPDATE",
            webhookHandler: async (topic, shop, body) => {
              enqueueProductUpdateOperation(shop, JSON.parse(body));
            },
          });

          if (!webhookRes.success) {
            console.error(
              `Failed to register PRODUCTS_UPDATE webhook:  ${webhookRes.result}`,
            );
          }

          context.redirect(`/online/auth/?shop=${shop}`);
        },
      }),
    );

    const router = new KoaRouter();

    router.post(
      "/graphql",
      verifyRequest({ returnHeader: true, authRoute: "/online/auth" }),
      async (context: Koa.Context) => {
        await Shopify.Utils.graphqlProxy(context.req, context.res);
      },
    );

    router.post("/webhooks", async (context) => {
      try {
        await Shopify.Webhooks.Registry.process(context.req, context.res);
        console.log("Webhook processed, returned status code 200");
      } catch (error: any) {
        console.error(`Failed to process webhook: ${error}`);
      }
    });

    router.post(
      "/api/reviews",
      verifyAppProxyExtensionSignatureMiddleware,
      KoaBody(),
      async (context) => {
        const shop = context.query.shop as string;
        const session = await Shopify.Utils.loadOfflineSession(shop);
        if (session == null) {
          context.res.statusCode = 401;
          return;
        }

        const grahpqlClient = new Shopify.Clients.Graphql(
          session.shop,
          session.accessToken,
        );

        try {
          await addReview(grahpqlClient, context.request.body);
          context.res.statusCode = 200;
        } catch (error: any) {
          console.error(error);
          context.res.statusCode = 500;
        }
      },
    );

    /**
     * This REST endpoint is responsible rfor returning whether the store's current main theme supports app blocks.
     */
    router.get(
      "/api/store/themes/main",
      verifyRequest({ authRoute: "/online/auth" }),
      async (context) => {
        const session = await Shopify.Utils.loadCurrentSession(
          context.req,
          context.res,
        );

        if (session == null) {
          context.res.statusCode = 401;
          return;
        }

        const restClient = new Shopify.Clients.Rest(
          session.shop,
          session.accessToken,
        );

        // Check if App Blocks are supported
        // --------------------------------------

        // Use `restClient.get` to request list of theme on store.
        const {
          body: { themes },
        } = (await restClient.get({
          path: "themes",
        })) as RESTAPIResponse<"themes">;

        // Find the published theme
        const publishedTheme = themes.find((theme) => theme.role === "main");
        if (publishedTheme == null) {
          // not found
          context.res.statusCode = 404;
          return;
        }

        // Get list of assets contained within the published theme
        const {
          body: { assets },
        } = (await restClient.get({
          path: `themes/${publishedTheme.id}/assets`,
        })) as RESTAPIResponse<"assets">;

        // Check if template JSON files exist for the template specified in APP_BLOCK_TEMPLATES
        const templateJSONFiles = assets.filter((asset) => {
          return APP_BLOCK_TEMPLATES.some(
            (template) => asset.key === `templates/${template}.json`,
          );
        });

        // Get bodies of template JSONs.
        const templateJSONAssetContents = await Promise.all(
          templateJSONFiles.map(async (file) => {
            const {
              body: { asset },
            } = (await restClient.get({
              path: `themes/${publishedTheme.id}/assets`,
              query: { "asset[key]": file.key },
            })) as RESTAPIResponse<"asset">;
            return asset;
          }),
        );

        const templateMainSections = templateJSONAssetContents
          .map((asset) => {
            const json = JSON.parse(asset.value);
            const main = json.sections.main && json.sections.main.type;
            return assets.find(
              (asset) => asset.key === `sections/${main}.liquid`,
            );
          })
          .filter((value) => value !== null);

        // Request the content of each section and check if it has a schema that contains a block of type '@app'
        const sectionsWithAppBlock = (
          await Promise.all(
            templateMainSections.map(async (section, index) => {
              if (section == null) {
                return null;
              }

              let acceptsAppBlock = false;
              const {
                body: { asset },
              } = (await restClient.get({
                path: `themes/${publishedTheme.id}/assets`,
                query: { "asset[key]": section.key },
              })) as RESTAPIResponse<"asset">;

              const match = asset.value.match(
                /\{\%\s+schema\s+\%\}([\s\S]*?)\{\%\s+endschema\s+\%\}/m,
              );
              if (match == null) {
                return null;
              }

              const schema = JSON.parse(match[1]);
              if (schema != null && schema.blocks) {
                acceptsAppBlock = schema.blocks.some(
                  (block: any) => block.type === "@app",
                );
              }

              return acceptsAppBlock ? section : null;
            }),
          )
        ).filter((value) => value !== null);

        const grahpqlClient = new Shopify.Clients.Graphql(
          session.shop,
          session.accessToken,
        );

        /**
         * Fetch one published product that's later used to build the editor preview url
         */
        const product = await getFirstPublishedProduct(grahpqlClient);
        const editorUrl = `https://${session.shop}/admin/themes/${
          publishedTheme.id
        }/editor?previewPath=${encodeURIComponent(
          `/products/${product.handle}`,
        )}`;

        const supportsSection = templateJSONFiles.length > 0;
        const supportsAppBlocks =
          supportsSection && sectionsWithAppBlock.length > 0;

        context.body = {
          theme: publishedTheme,
          supportsSection,
          supportsAppBlocks,
          containsAverageRatingAppBlock: containsAppBlock(
            templateJSONAssetContents[0].value,
            "average-rating",
            process.env.THEME_APP_EXTENSION_UUID,
          ),
          containsProductReviewsAppBlock: containsAppBlock(
            templateJSONAssetContents[0].value,
            "product-reviews",
            process.env.THEME_APP_EXTENSION_UUID,
          ),
          editorUrl,
        };
        context.res.statusCode = 200;
      },
    );

    // Static content
    router.get("(/_next/static/.*)", handleRequest);
    // Webpack content
    router.get("/_next/webpack-hmr", handleRequest);
    // Embedded app Next.js entry point
    router.get("(.*)", verifyIfActiveShopifyShop, handleRequest);

    server.use(router.allowedMethods());
    server.use(router.routes());
    server.listen(port, () => {
      console.log(`>  Ready on http://localhost:${port}`);
    });
  } catch (error: any) {
    console.error(error);
  }
})();

import next from "next";
import dotenv from "dotenv";
import Koa, { ExtendableContext } from "koa";
import KoaRouter from "koa-router";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";

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
  SCOPES: SCOPES.split(","),
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string } = {};
const verifyIfActiveShopifyShop = (context: Koa.Context, next: Koa.Next) => {
  const shop = context.query.shop as string;
  if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
    context.redirect(`/auth?shop=${shop}`);
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
        afterAuth: async (context) => {
          const { shop, scope } = context.state.shopify;
          const host = context.query.host as string;
          ACTIVE_SHOPIFY_SHOPS[shop] = scope;
          context.redirect(
            `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}?shop=${shop}&host=${host}`,
          );
        },
      }),
    );

    const router = new KoaRouter();

    /**
     * This REST endpoint is responsible rfor returning whether the store's current main theme supports app blocks.
     */
    router.get(
      "/api/store/themes/main",
      verifyRequest({ authRoute: "/auth" }),
      async (context) => {
        console.log(context);
        const session = await Shopify.Utils.loadCurrentSession(
          context.req,
          context.res,
        );
        console.log(`session: ${session}`);
        context.body = {
          hoge: "fuga",
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

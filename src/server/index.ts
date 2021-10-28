import next from "next";
import dotenv from "dotenv";
import Koa, { ExtendableContext } from "koa";
import KoaRouter from "koa-router";
import KoaBodyParser from "koa-bodyparser";

dotenv.config();
const port =
  process.env.PORT != null ? parseInt(process.env.PORT, 10) || 8081 : 8081;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({
  dev,
});

const nextAppHandle = nextApp.getRequestHandler();
const handleRequest = async (context: ExtendableContext) => {
  await nextAppHandle(context.req, context.res);
  context.respond = false;
  context.res.statusCode = 200;
};

(async () => {
  try {
    await nextApp.prepare();
    const server = new Koa();
    server.keys = ["SECRET_KEY"];

    const router = new KoaRouter();
    // Static content
    router.get("(/_next/static/.*)", handleRequest);
    // Webpack content
    router.get("/_next/webpack-hmr", handleRequest);
    // Embedded app Next.js entry point
    router.get("(.*)", handleRequest);

    server.use(router.allowedMethods());
    server.use(router.routes());
    server.listen(port, () => {
      console.log(`>  Ready on http://localhost:${port}`);
    });
  } catch (error: any) {
    console.error(error);
  }
})();

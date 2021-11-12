import Koa from "koa";
import { ParsedUrlQuery } from "querystring";
import crypto from "crypto";

const verifyAppProxyExtensionSignature = (
  query: ParsedUrlQuery,
  shopifyAPISecret: string,
) => {
  console.log("===== start verifyAppProxyExtensionSignature =====");
  const { signature = "", ...rest } = query;
  const input = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("");
  const hmac = crypto
    .createHmac("sha256", shopifyAPISecret)
    .update(input)
    .digest("hex");

  const digest = Buffer.from(hmac, "utf-8");
  const checksum = Buffer.from(signature as string, "utf-8");
  const result =
    digest.length === checksum.length &&
    crypto.timingSafeEqual(digest, checksum);

  console.info(`verify result is ${result}`);
  console.log("===== finish verifyAppProxyExtensionSignature =====");
  return result;
};

export const verifyAppProxyExtensionSignatureMiddleware = (
  context: Koa.Context,
  next: Koa.Next,
) => {
  if (
    verifyAppProxyExtensionSignature(
      context.query,
      process.env.SHOPIFY_API_SECRET,
    )
  ) {
    return next();
  }
  context.res.statusCode = 401;
};

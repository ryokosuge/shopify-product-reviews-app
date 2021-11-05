import React from "react";
import { default as NextLink } from "next/link";
import { LinkLikeComponent } from "@shopify/polaris/build/ts/latest/src/utilities/link";

export const Link: LinkLikeComponent = ({
  children,
  external,
  url,
  ...rest
}) => {
  const mailto = url.startsWith("mailto:");
  if (external || mailto) {
    const target = external ? "_blank" : "_top";
    const rel = external ? "noopener noreferrer" : undefined;
    return <a target={target} href={url} rel={rel} {...rest}></a>;
  }

  return (
    <NextLink href={url}>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};

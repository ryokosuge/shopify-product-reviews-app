import { Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ProductDetailPage: NextPage = () => {
  const { back } = useRouter();
  return (
    <Page
      title="Product Reviews"
      breadcrumbs={[
        {
          onAction: back,
          accessibilityLabel: "Go back to previous page",
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <p>Product reviews</p>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductDetailPage;

import { Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { generateShopifyProductGID } from "../../../utils/generateShopifyProductGID";

const CreateReview: NextPage = () => {
  const { query, back } = useRouter();
  const product_id = query.product_id as string;
  const gid = generateShopifyProductGID(product_id);
  return (
    <Page
      title="New Draft Review"
      breadcrumbs={[
        {
          onAction: back,
          accessibilityLabel: "Go back to previous page.",
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <p>
            Create Reviews Product({product_id}) {gid}
          </p>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CreateReview;

import { Layout, Page, Spinner, Stack } from "@shopify/polaris";
import { NextPage } from "next";
import React from "react";

const GettingStartedPage: NextPage = () => {
  return (
    <Page title="Getting Started">
      <Layout>
        <Layout.Section>
          <Stack distribution="center">
            <Spinner />
          </Stack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default GettingStartedPage;

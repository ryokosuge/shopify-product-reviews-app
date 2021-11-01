import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout, Page, Spinner, Stack } from "@shopify/polaris";

const IndexPage: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/getting-started");
  }, [router]);
  return (
    <Page>
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

export default IndexPage;

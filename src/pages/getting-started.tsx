import { useAppBridge } from "@shopify/app-bridge-react";
import { Layout, Page, Spinner, Stack } from "@shopify/polaris";
import { NextPage } from "next";
import React from "react";
import useSWR from "swr";
import { fetch } from "../lib/app-bridge";

const GettingStartedPage: NextPage = () => {
  const app = useAppBridge();
  const fetcher = React.useMemo(() => {
    return async (uri: RequestInfo, options?: RequestInit) => {
      return fetch(app)(uri, options).then((response) => response?.json());
    };
  }, [app]);
  const { data } = useSWR("/api/store/themes/main", fetcher);
  console.log(`data:  ${JSON.stringify(data, null, 2)}`);
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

import React, { ReactNode } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Caption,
  Card,
  DisplayText,
  Icon,
  Layout,
  Link,
  Page,
  Spinner,
  Stack,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
import { NextPage } from "next";
import useSWR from "swr";
import { fetch } from "../lib/app-bridge";
import { CircleTickOutlineMinor, RiskMinor } from "@shopify/polaris-icons";
import { Theme } from "../types/rest-api";
import { StoreThemesMainRespose } from "../types/api";
import { useRouter } from "next/router";

type GettingStartedStepProps = {
  title: string;
  description?: ReactNode;
  completed: boolean;
};

const GettingStartedStep: React.FC<GettingStartedStepProps> = ({
  title,
  description,
  completed,
}) => {
  const source = completed ? CircleTickOutlineMinor : RiskMinor;
  const color = completed ? "success" : "critical";
  return (
    <Stack vertical>
      <Stack.Item>
        <Stack>
          <Stack.Item>
            <Icon color={color} source={source} />
          </Stack.Item>
          <Stack.Item>
            <TextStyle variation="strong">{title}</TextStyle>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {description && (
        <Stack.Item>
          <TextStyle variation="positive">{description}</TextStyle>
        </Stack.Item>
      )}
    </Stack>
  );
};

type AppBlockSetupLayoutProps = {
  theme: Theme;
  supportsAppBlocks: boolean;
  supportsSection: boolean;
  containsAverageRatingAppBlock: boolean;
  containsProductReviewsAppBlock: boolean;
  editorUrl: string;
};
const AppBlockSetupLayout: React.FC<AppBlockSetupLayoutProps> = ({
  theme,
  supportsAppBlocks: supportedAppBlocks,
  supportsSection: supportedSection,
  containsAverageRatingAppBlock,
  containsProductReviewsAppBlock,
  editorUrl,
}) => (
  <Layout.AnnotatedSection
    title="Theme app blocks setup"
    description="Provide a way for your customers to engage with you and boost your sales by making sure you have installed the product reviews app blocks."
  >
    <Card>
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <GettingStartedStep
              title="Average Review Score"
              completed={containsAverageRatingAppBlock}
            />
          </Stack.Item>
          <Stack.Item>
            <GettingStartedStep
              title="Product Reviews"
              completed={containsProductReviewsAppBlock}
            />
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Card.Section>
        {supportedAppBlocks && supportedSection && (
          <p>
            Edit the product page for theme (
            <TextStyle variation="strong">{theme.name}</TextStyle>) in the{" "}
            <Link external url={editorUrl}>
              editor
            </Link>{" "}
            to add or update app blocks
          </p>
        )}
        {(!supportedAppBlocks || !supportedSection) && (
          <p>Setup is only possible with supported themes.</p>
        )}
      </Card.Section>
    </Card>
  </Layout.AnnotatedSection>
);

type CurrentThemeLayoutProps = {
  theme: Theme;
  supportedSection: boolean;
  supportedAppBlocks: boolean;
};

const CurrentThemeLayout: React.FC<CurrentThemeLayoutProps> = ({
  theme,
  supportedSection,
  supportedAppBlocks,
}) => {
  const appBlockUnsupportedDescription = (
    <p>
      Currently published theme&aposs{" "}
      <TextStyle variation="strong">main-product</TextStyle> section (
      <TextStyle variation="strong">{theme.name}</TextStyle>) dose not support
      app blocks.
    </p>
  );

  const sectionsEverywhereUnsupportedDescription = (
    <p>
      Currently published theme (
      <TextStyle variation="strong">{theme.name}</TextStyle>) does not support
      Sections Everywhere.
    </p>
  );

  return (
    <Layout.AnnotatedSection
      title="Current theme"
      description="Ensure your current theme fully supports theme app extensions."
    >
      <Card>
        <Card.Section>
          <Stack vertical>
            <Stack.Item>
              <GettingStartedStep
                title="Sections Everywhere support"
                completed={supportedSection}
                description={
                  !supportedSection && sectionsEverywhereUnsupportedDescription
                }
              />
            </Stack.Item>
            <Stack.Item>
              <GettingStartedStep
                title="App block support"
                completed={supportedAppBlocks}
                description={
                  !supportedAppBlocks && appBlockUnsupportedDescription
                }
              />
            </Stack.Item>
          </Stack>
        </Card.Section>
        <Card.Section>
          {supportedAppBlocks && supportedSection && (
            <p>Your theme fully supports app blocks 🎉</p>
          )}
          {(!supportedAppBlocks || !supportedSection) && (
            <TextContainer>
              <p>
                It looks like your theme does not fully support the
                functionality of this app.
              </p>
              <p>
                Try switching to a different theme or contacting your theme
                developer to request support.
              </p>
            </TextContainer>
          )}
        </Card.Section>
      </Card>
    </Layout.AnnotatedSection>
  );
};

const GettingStartedPage: NextPage = () => {
  const app = useAppBridge();
  const router = useRouter();
  const fetcher = React.useMemo(() => {
    return async (uri: RequestInfo, options?: RequestInit) => {
      return fetch(app)(uri, options).then((response) => response?.json());
    };
  }, [app]);
  const { data } = useSWR<StoreThemesMainRespose>(
    "/api/store/themes/main",
    fetcher,
  );

  const handleShowReviewedProductsAction = () => {
    router.push("/products");
  };

  return (
    <Page
      title="Getting Started"
      primaryAction={{
        content: "Show Reviewed Products",
        onAction: handleShowReviewedProductsAction,
      }}
    >
      <Layout>
        {data == null ? (
          <Layout.Section>
            <Stack distribution="center">
              <Spinner />
            </Stack>
          </Layout.Section>
        ) : (
          <>
            <CurrentThemeLayout
              theme={data.theme}
              supportedAppBlocks={data.supportsAppBlocks}
              supportedSection={data.supportsSection}
            />
            <AppBlockSetupLayout
              theme={data.theme}
              supportsAppBlocks={data.supportsAppBlocks}
              supportsSection={data.supportsSection}
              containsAverageRatingAppBlock={data.containsAverageRatingAppBlock}
              containsProductReviewsAppBlock={
                data.containsProductReviewsAppBlock
              }
              editorUrl={data.editorUrl}
            />
          </>
        )}
      </Layout>
    </Page>
  );
};

export default GettingStartedPage;

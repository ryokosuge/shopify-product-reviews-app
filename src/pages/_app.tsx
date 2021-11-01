import "@shopify/polaris/build/esm/styles.css";

import NextApp from "next/app";
import type { AppContext, AppInitialProps, AppProps } from "next/app";

import { AppProvider as PolarisAppProvider } from "@shopify/polaris";

import translations from "@shopify/polaris/locales/en.json";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";

const App = ({ Component, pageProps }: AppProps) => {
  const host = pageProps.host as string;
  const config = {
    host,
    apiKey: SHOPIFY_API_KEY,
    forceRedirect: true,
  };
  return (
    <PolarisAppProvider i18n={translations}>
      <AppBridgeProvider config={config}>
        <Component {...pageProps} />
      </AppBridgeProvider>
    </PolarisAppProvider>
  );
};

App.getInitialProps = async (
  appContext: AppContext,
): Promise<AppInitialProps> => {
  const host = appContext.ctx.query.host as string;
  const appProps = NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    pageProps: {
      host,
    },
  };
};

export default App;

import "@shopify/polaris/build/esm/styles.css";

import React from "react";
import NextApp from "next/app";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import { useRouter } from "next/router";

import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
  useRoutePropagation,
} from "@shopify/app-bridge-react";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import { useRouteChangeLoader } from "../hooks/useRouteChangeLoader";
import { fetch } from "../lib/app-bridge";
import { Link } from "../components/Link/Link";

const ApolloClientProvider: React.FC = ({ children }) => {
  // App Bridge
  const app = useAppBridge();

  // Apollo Client
  const client = React.useMemo(
    () =>
      new ApolloClient({
        link: new HttpLink({ fetch: fetch(app), credentials: "include" }),
        cache: new InMemoryCache(),
      }),
    [app],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const RoutePropagationProvider: React.FC = () => {
  // App Bridge
  const app = useAppBridge();

  // route propagation
  const router = useRouter();
  useRoutePropagation(router.asPath);
  useRouteChangeLoader();

  React.useEffect(() => {
    const unsubscribe = app.subscribe(Redirect.Action.APP, ({ path }) => {
      if (router.asPath !== path) {
        router.push(path);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [app, router]);

  return null;
};

const App = ({ Component, pageProps }: AppProps) => {
  const host = pageProps.host as string;
  const config = {
    host,
    apiKey: SHOPIFY_API_KEY,
    forceRedirect: true,
  };

  return (
    <PolarisAppProvider i18n={translations} linkComponent={Link}>
      <AppBridgeProvider config={config}>
        <RoutePropagationProvider />
        <ApolloClientProvider>
          <Component {...pageProps} />
        </ApolloClientProvider>
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

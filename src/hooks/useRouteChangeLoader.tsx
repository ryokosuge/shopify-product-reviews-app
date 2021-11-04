import React from "react";
import { useRouter } from "next/router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Loading } from "@shopify/app-bridge/actions";

export const useRouteChangeLoader = () => {
  const router = useRouter();
  const app = useAppBridge();

  React.useEffect(() => {
    const loading = Loading.create(app);

    const routeChangeStart = () => {
      loading.dispatch(Loading.Action.START);
    };

    const routeChangeEnd = () => {
      loading.dispatch(Loading.Action.STOP);
    };

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeEnd);
    router.events.on("routeChangeError", routeChangeEnd);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeEnd);
      router.events.off("routeChangeError", routeChangeEnd);
    };
  }, [router, app]);
};

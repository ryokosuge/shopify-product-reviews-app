import { ClientApplication } from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

export const fetch = (app: ClientApplication<any>) => {
  const fetchFunction = authenticatedFetch(app);
  return async (request: RequestInfo, options?: RequestInit) => {
    const response = await fetchFunction(request, options);
    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize",
      );
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || "/auth");
      return response;
    }
    return response;
  };
};

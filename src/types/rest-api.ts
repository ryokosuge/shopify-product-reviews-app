export type RESTAPIResponse<T extends keyof RESTOnlineStore> = {
  body: RESTAPIResponseBody<T>;
};

export type RESTAPIResponseBody<T extends keyof RESTOnlineStore> = Pick<
  RESTOnlineStore,
  T
>;

type RESTOnlineStore = {
  themes: Theme[];
  asset: SingleAsset;
  assets: Asset[];
};

export type Theme = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  role: ThemeRole;
  theme_store_id: number | null;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
};

export type ThemeRole = "main" | "demo" | "unpublished";

export type SingleAsset = {
  key: string;
  value: string;
  public_url: string | null;
  created_at: string;
  updated_at: string;
  content_type: AssetContentType;
  size: number;
  checksum: string | null;
  theme_id: number;
};

export type Asset = Omit<SingleAsset, "value">;

export type AssetContentType =
  | "application/x-liquid"
  | "application/json"
  | "image/gif"
  | "application/javascript"
  | "image/jpeg"
  | "image/png"
  | "text/css";

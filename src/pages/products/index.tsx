import { ResourcePicker } from "@shopify/app-bridge-react";
import { SelectPayload } from "@shopify/app-bridge-react/components/ResourcePicker/ResourcePicker";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import {
  Card,
  EmptyState,
  Heading,
  Layout,
  Page,
  ResourceList,
  Thumbnail,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { NextPage } from "next";
import router from "next/router";
import React from "react";
import { Rating } from "../../components/Rating";
import { useProducts } from "../../hooks/useProducts";
import { extractIdFromGID } from "../../utils/extractIdFromGID";

type ResourceListItem = {
  id: string;
  name: string;
  url: string;
  media: JSX.Element;
  avgReview: string;
};

const renderItem = ({ id, name, url, media, avgReview }: ResourceListItem) => (
  <ResourceList.Item
    id={id}
    url={url}
    media={media}
    accessibilityLabel={`View details for ${name}`}
  >
    <Heading element="h2">{name}</Heading>
    <Rating rating={avgReview} />
  </ResourceList.Item>
);

const ProductsPage: NextPage = () => {
  const [isOpenResourcePicker, setIsOpenResourcePicker] =
    React.useState<boolean>(false);
  const [queryValue, setQueryValue] = React.useState<string>("");
  const { products, loading } = useProducts({ query: queryValue });

  const items = products.map((product) => ({
    id: product.id,
    name: product.title,
    url: `products/${extractIdFromGID(product.id)}`,
    media: (
      <Thumbnail
        source={product.featuredImage?.originalSrc || ImageMajor}
        alt={product.title}
      />
    ),
    avgReview: "5",
  }));

  const handleSelection = ({ selection = [] }: SelectPayload) => {
    const products = selection as Product[];
    if (products.length === 0) {
      setIsOpenResourcePicker(false);
      return;
    }

    const product = products[0];
    const productID = extractIdFromGID(product.id);
    router.push(`/products/${productID}/create-review`);
  };

  const emptyStateMarkup = () => (
    <EmptyState
      heading="You don't have any products with reviews yet"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Once you have products with reviews they will display on this page</p>
    </EmptyState>
  );

  return (
    <Page
      title="Reviewed Products"
      primaryAction={{
        content: "Create Review",
        onAction: () => setIsOpenResourcePicker(true),
      }}
    >
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        selectMultiple={false}
        open={isOpenResourcePicker}
        onCancel={() => setIsOpenResourcePicker(false)}
        initialQuery={queryValue}
        actionVerb={ResourcePicker.ActionVerb.Select}
        onSelection={handleSelection}
      />
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{ singular: "product", plural: "products" }}
              showHeader
              emptyState={emptyStateMarkup}
              items={items}
              loading={false}
              renderItem={renderItem}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductsPage;

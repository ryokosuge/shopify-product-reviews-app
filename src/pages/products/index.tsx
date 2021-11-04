import { ResourcePicker } from "@shopify/app-bridge-react";
import { SelectPayload } from "@shopify/app-bridge-react/components/ResourcePicker/ResourcePicker";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import { Card, Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import router from "next/router";
import React from "react";
import { extractIdFromGID } from "../../utils/extractIdFromGID";

const ProductsPage: NextPage = () => {
  const [isOpenResourcePicker, setIsOpenResourcePicker] =
    React.useState<boolean>(false);
  const [queryValue, setQueryValue] = React.useState<string>("");

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
            <p>Reviewed Products</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductsPage;

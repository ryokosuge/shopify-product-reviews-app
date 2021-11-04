import { Card, Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ReviewList } from "../../../components/ReviewList";
import { useProductReviews } from "../../../hooks/useProductReviews";
import { ReviewStateType } from "../../../types/review";
import { generateShopifyProductGID } from "../../../utils/generateShopifyProductGID";

const ProductDetailPage: NextPage = () => {
  const { query } = useRouter();
  const productId = query.product_id as string;
  const state = query.state as ReviewStateType;
  const productGID = generateShopifyProductGID(productId);

  const {
    reviews,
    loading: reviewsLoading,
    refetch: reviewsRefetch,
  } = useProductReviews({ productId: productGID, state: state });

  return (
    <Page
      title="Product Reviews"
      breadcrumbs={[
        {
          url: "/products",
          accessibilityLabel: "Go back to previous page",
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <ReviewList
              state={state}
              reviews={reviews}
              loading={reviewsLoading}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductDetailPage;

import { Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import router, { useRouter } from "next/router";
import React from "react";
import { ReviewForm } from "../../../components/ReviewForm";
import { useProductMetafieldCreate } from "../../../hooks/useProductMetafieldCreate";
import { ReviewFormType } from "../../../types/review";
import { generateReviewMetaFieldValue } from "../../../utils/generateReviewMetaFieldValue";
import { generateShopifyProductGID } from "../../../utils/generateShopifyProductGID";

const CreateReview: NextPage = () => {
  const { query, back } = useRouter();
  const productId = query.product_id as string;

  const createProductMetafield = useProductMetafieldCreate();

  const handleSubmitReviewForm = async (data: ReviewFormType) => {
    const gid = generateShopifyProductGID(productId);
    const metafield = generateReviewMetaFieldValue(data);
    await createProductMetafield({ productId: gid, metafield });
    /**
     * After the new review is created, redirect to the product review page
     * with the "unpublished tab active (this is where to new review will show up)"
     */
    router.push({
      pathname: `/products/${productId}`,
      query: {
        state: "unpublished",
      },
    });
    return;
  };

  return (
    <Page
      title="New Draft Review"
      breadcrumbs={[
        {
          onAction: back,
          accessibilityLabel: "Go back to previous page.",
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <ReviewForm onSubmit={handleSubmitReviewForm} />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CreateReview;

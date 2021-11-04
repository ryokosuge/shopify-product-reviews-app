import { Layout, Page } from "@shopify/polaris";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ReviewForm } from "../../../components/ReviewForm";
import { useProductMetafieldCreate } from "../../../hooks/useProductMetafieldCreate";
import { ReviewFormType } from "../../../types/review";
import { generateReviewMetaFieldValue } from "../../../utils/generateReviewMetaFieldValue";
import { generateShopifyProductGID } from "../../../utils/generateShopifyProductGID";

const CreateReview: NextPage = () => {
  const { query, back } = useRouter();
  const product_id = query.product_id as string;

  const createProductMetafield = useProductMetafieldCreate();

  const handleSubmitReviewForm = async (data: ReviewFormType) => {
    const gid = generateShopifyProductGID(product_id);
    const metafield = generateReviewMetaFieldValue(data);
    await createProductMetafield({ productId: gid, metafield });
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

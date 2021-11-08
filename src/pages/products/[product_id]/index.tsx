import {
  Card,
  Layout,
  Page,
  Stack,
  TextContainer,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ProductInfoSkeleton } from "../../../components/ProductInfoSkeleton";
import { Rating } from "../../../components/Rating";
import { ReviewList } from "../../../components/ReviewList";
import { useProduct } from "../../../hooks/useProduct";
import {
  ProductReviewMetaField,
  useProductReviews,
} from "../../../hooks/useProductReviews";
import { usePublishReviews } from "../../../hooks/usePublishReviews";
import { useUnpublishReviews } from "../../../hooks/useUnpublishReviews";
import { ReviewState, ReviewStateType } from "../../../types/review";
import { generateShopifyProductGID } from "../../../utils/generateShopifyProductGID";

type BlukAction = (value: {
  productId: string;
  reviews: ProductReviewMetaField[];
}) => Promise<void>;

const ProductDetailPage: NextPage = () => {
  const { query, push } = useRouter();
  const productId = query.product_id as string;
  const state =
    query.state == ReviewState.Unpublished
      ? ReviewState.Unpublished
      : ReviewState.Published;
  const productGID = generateShopifyProductGID(productId);
  const { product, loading: productLoading, error } = useProduct(productGID);

  const {
    reviews,
    loading: reviewsLoading,
    refetch: reviewsRefetch,
  } = useProductReviews({ productId: productGID, state: state });

  const { publishAll, loading: publishing } = usePublishReviews();
  const { unpublishAll, loading: unpublishing } = useUnpublishReviews();

  const handleBlukAction = React.useCallback(
    async (ids: string[], blukAction: BlukAction) => {
      const reviewMetafields = ids
        .map((id) => reviews.find((review) => review.id === id))
        .filter((item): item is NonNullable<typeof item> => item != null);
      await blukAction({ productId: productGID, reviews: reviewMetafields });
      await reviewsRefetch();
    },
    [productGID, reviews, reviewsRefetch],
  );

  const blukActions = React.useMemo(() => {
    const publishAction = {
      content: "Publish Selected",
      onAction: (ids: string[]) => handleBlukAction(ids, publishAll),
    };

    const unpublishAction = {
      content: "Unpublish Selected",
      onAction: (ids: string[]) => handleBlukAction(ids, unpublishAll),
    };

    return state === ReviewState.Unpublished
      ? [publishAction]
      : [unpublishAction];
  }, [state, handleBlukAction, publishAll, unpublishAll]);

  const handleChangeTab = (state: ReviewStateType) => {
    push({
      pathname: `/products/${productId}`,
      query: {
        state,
      },
    });
  };

  const productInfoMarkup = () => {
    if (productLoading) {
      return (
        <Layout.Section>
          <Card sectioned>
            <ProductInfoSkeleton />
          </Card>
        </Layout.Section>
      );
    }

    console.log(product);

    if (error) {
      return (
        <Layout.Section>
          <Card sectioned>
            <p>{error.message}</p>
          </Card>
        </Layout.Section>
      );
    }

    const productThumbnailUrl = product?.featuredImage?.originalSrc ?? "";
    return (
      <Layout.Section>
        <Card
          title={product?.title}
          sectioned
          actions={[
            {
              content: "Create Review",
              url: `/products/${productId}/create-review`,
            },
          ]}
        >
          <Stack alignment="center">
            <Stack.Item>
              <Thumbnail source={productThumbnailUrl} alt="" />
            </Stack.Item>
            <Stack.Item>
              <TextContainer>
                <TextStyle variation="strong">Overall Rating</TextStyle>
                <Rating rating="3" />
              </TextContainer>
            </Stack.Item>
          </Stack>
        </Card>
      </Layout.Section>
    );
  };

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
        {productInfoMarkup()}
        <Layout.Section>
          <Card sectioned>
            <ReviewList
              state={state}
              reviews={reviews}
              loading={reviewsLoading}
              processing={publishing || unpublishing}
              onChangeTab={handleChangeTab}
              blukActions={blukActions}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductDetailPage;

import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql";
import { nanoid } from "nanoid";
import { PROUDCT_METAFIELD_CREATE } from "../../graphql/mutations/productMetafieldCreate";
import { ReviewMetafield, ReviewState } from "../../types/review";
import { generateShopifyProductGID } from "../../utils/generateShopifyProductGID";
import { createProductMetafieldPrivateReview } from "../graphql/mutations/createProductMetafieldPrivateReview";

type Payload = {
  product_id: string;
  review: {
    rating: string;
    author: string;
    email: string;
    title: string;
    body: string;
  };
};

export const addReview = async (client: GraphqlClient, payload: Payload) => {
  console.log("===== start addReview =====");
  console.log(`payload: ${JSON.stringify(payload)}`);
  const {
    product_id: productID,
    review: { rating, author, email, title: reviewTitle, body: reviewBody },
  } = payload;

  const review: ReviewMetafield = {
    id: nanoid(),
    rating,
    name: author,
    reviewTitle,
    reviewBody,
    email,
    created_at: new Date().toISOString(),
    state: ReviewState.Unpublished,
  };
  console.log(`review: ${JSON.stringify(review)}`);

  const productGID = generateShopifyProductGID(productID);
  console.log(`productGID:  ${productGID}`);
  await createProductMetafieldPrivateReview(client, productGID, review);
};

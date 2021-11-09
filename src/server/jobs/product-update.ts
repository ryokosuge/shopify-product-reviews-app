import Shopify from "@shopify/shopify-api";
import async from "async";
import { MESSAGE_TYPE } from "../../constants/message_type";
import {
  ProductQueueMessage,
  ProductRatings,
  ReviewState,
} from "../../types/review";
import { deleteQueueMessages } from "../graphql/mutations/deleteQueueMessages";
import { updateProductAVGRating } from "../graphql/mutations/updateProductAvgRating";
import { updateProductRatings } from "../graphql/mutations/updateProductRatings";
import { getProductQueueMessages } from "../graphql/queries/getProductQueueMessages";
import { getProductRatings } from "../graphql/queries/getProductRatings";

type Product = {
  id: string;
  admin_graphql_api_id: string;
};

const performProductUpdateOperations = async (
  {
    shop,
    product,
  }: {
    shop: string;
    product: Product;
  },
  callback: async.ErrorCallback,
) => {
  console.info("====== start performProductUpdateOperations ======");
  const { admin_graphql_api_id: productGID, id: productID } = product;
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const client = new Shopify.Clients.Graphql(shop, session?.accessToken);

  // We emulate how a message broker worker.
  // Here we retrieve all mesasges/events that were dispatched for a
  // given product regarding publishing, unpublishing or deleting.
  const messages = await getProductQueueMessages(client, productGID);
  const ratingUpdateMessages = getRaitingUpdateMessages(messages);

  if (ratingUpdateMessages.length > 0) {
    const ratings = await getProductRatings(client, productGID);
    const newRatings = calculateProductRatings(ratingUpdateMessages, ratings);
    await updateProductRatings(client, productGID, newRatings);

    const newAverageRatings = calculateWeightedAverageRating(newRatings);
    await updateProductAVGRating(client, productGID, newAverageRatings);
  }

  await deleteQueueMessages(client, messages);
  callback();
  console.info("====== finish performProductUpdateOperations ======");
};

const jobQueue = async.queue(performProductUpdateOperations, 1);

export const enqueueProductUpdateOperation = (
  shop: string,
  product: Product,
) => {
  jobQueue.push({ shop, product });
};

const getRaitingUpdateMessages = (messages: ProductQueueMessage[]) => {
  return messages.filter((message) => {
    const {
      value: {
        type,
        data: { review_snapshot: reviewSnapshot },
      },
    } = message;

    const isPublishedDelete =
      MESSAGE_TYPE.REVIEW_DELETED === type &&
      reviewSnapshot.state === ReviewState.Published;

    const publishOrUnpublish = (
      [
        MESSAGE_TYPE.REVIEW_PUBLISHED,
        MESSAGE_TYPE.REVIEW_UNPUBLISHED,
      ] as string[]
    ).includes(type);

    return isPublishedDelete || publishOrUnpublish;
  });
};

const isRating = (num: number): num is 1 | 2 | 3 | 4 | 5 => {
  return 0 < num && num <= 5;
};

const calculateProductRatings = (
  messages: ProductQueueMessage[],
  oldRatings: ProductRatings,
) => {
  const newRatings = Object.assign({}, oldRatings);
  messages.forEach((message) => {
    const {
      value: {
        type,
        data: {
          review_snapshot: { rating },
        },
      },
    } = message;

    const rateNum = parseInt(rating, 10);
    if (isNaN(rateNum) || !isRating(rateNum)) {
      return;
    }

    const ratingClass = newRatings[rateNum];
    const offset = type === MESSAGE_TYPE.REVIEW_PUBLISHED ? 1 : -1;
    const newTotal = Math.max(0, ratingClass.total + rateNum * offset);
    newRatings[rateNum] = { ...ratingClass, total: newTotal };
  });

  return newRatings;
};

const calculateWeightedAverageRating = (ratings: ProductRatings) => {
  const sumTotals = Object.values(ratings).reduce(
    (value, rate) => value + rate.total,
    0,
  );

  if (sumTotals <= 0) {
    return 0;
  }

  const newAverage =
    Object.values(ratings).reduce(
      (value, rate) => value + rate.weight * rate.total,
      0,
    ) / sumTotals;

  return Math.round(newAverage * 10) / 10;
};

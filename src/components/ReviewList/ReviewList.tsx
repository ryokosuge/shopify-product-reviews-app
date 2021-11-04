import { formatDate } from "@shopify/dates";
import {
  Caption,
  EmptyState,
  Heading,
  ResourceList,
  Tabs,
  TextStyle,
} from "@shopify/polaris";
import React from "react";
import { ProductReviewMetaField } from "../../hooks/useProductReviews";
import { ReviewStateType } from "../../types/review";
import { Rating } from "../Rating";
import styles from "./ReviewList.module.css";

const TAB_INDEX = {
  published: 0,
  unpublished: 1,
} as const;

const TABS: {
  id: ReviewStateType;
  content: string;
  accessibilityLabel: string;
}[] = [
  {
    id: "published",
    content: "Published",
    accessibilityLabel: "Published Reviews",
  },
  {
    id: "unpublished",
    content: "Unpublished",
    accessibilityLabel: "Unpublished Reviews",
  },
];

type ReviewListItemProps = {
  review: ProductReviewMetaField;
};

const ReviewListItem: React.FC<ReviewListItemProps> = ({ review }) => {
  const formattedDate = formatDate(new Date(review.value.created_at), "en", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return (
    <article>
      <Heading element="h3">{review.value.reviewTitle}</Heading>
      <div className={styles.Rating}>
        <Rating rating={review.value.rating} />
      </div>
      <p>{review.value.reviewBody}</p>
      <div className={styles.Caption}>
        <Caption>
          Reviewed on {formattedDate} by {review.value.name} -{" "}
          {review.value.email}
        </Caption>
      </div>
    </article>
  );
};

export type ReviewBlukAction = {
  content: string;
  onAction: (ids: string[]) => Promise<void>;
};

export type ReviewListProps = {
  state: ReviewStateType;
  reviews: ProductReviewMetaField[];
  loading: boolean;
  blukActions: ReviewBlukAction[];
  onChangeTab: (state: ReviewStateType) => void;
};

export const ReviewList: React.FC<ReviewListProps> = ({
  state,
  reviews,
  loading,
  blukActions,
  onChangeTab,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(
    TAB_INDEX[state],
  );

  const [selectedReviews, setSelectedReviews] = React.useState<string[]>([]);

  const handleSelectedTab = React.useCallback(
    (selectedTabIndex: number) => {
      setSelectedReviews([]);
      setSelectedTabIndex(selectedTabIndex);
      onChangeTab(TABS[selectedTabIndex].id);
    },
    [onChangeTab],
  );
  const sortedReviews = React.useMemo(() => {
    return reviews;
  }, [reviews]);

  const emptyStateMarkup = (
    <EmptyState
      heading={`You have 0 ${state} reviews`}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <TextStyle variation="subdued">
        Try changing the filters for different results
      </TextStyle>
    </EmptyState>
  );

  const promotedBulkActions = blukActions.map((action) => ({
    ...action,
    onAction: async () => {
      await action.onAction(selectedReviews);
      setSelectedReviews([]);
    },
  }));

  return (
    <Tabs tabs={TABS} selected={selectedTabIndex} onSelect={handleSelectedTab}>
      <ResourceList
        resourceName={{
          singular: "review",
          plural: "reviews",
        }}
        items={sortedReviews}
        selectedItems={selectedReviews}
        onSelectionChange={(selectedItems) => {
          if (selectedItems === "All") {
            setSelectedReviews(sortedReviews.map((review) => review.id));
          } else {
            setSelectedReviews(selectedItems);
          }
        }}
        loading={loading}
        renderItem={(item) => (
          <ResourceList.Item
            id={item.id}
            onClick={() => setSelectedReviews([...selectedReviews, item.id])}
            accessibilityLabel={`Select review entitled: ${item.value.reviewTitle}`}
          >
            <ReviewListItem review={item} />
          </ResourceList.Item>
        )}
        emptyState={emptyStateMarkup}
        promotedBulkActions={promotedBulkActions}
      />
    </Tabs>
  );
};

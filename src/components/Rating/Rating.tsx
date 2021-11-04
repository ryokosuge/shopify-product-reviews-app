import React from "react";
import { StarFilledMinor, StarOutlineMinor } from "@shopify/polaris-icons";

import styles from "./Rating.module.css";
import { MAX_RATING, MIN_RATING } from "../../constants/rating";
import { Icon, IconProps, TextStyle } from "@shopify/polaris";

const FULL_STAR = "*";
const EMPTY_STAR = "-";

const STAR_ICONS = {
  [FULL_STAR]: StarFilledMinor,
  [EMPTY_STAR]: StarOutlineMinor,
};

const clampRating = (value: number) => {
  return value < MIN_RATING ? MIN_RATING : Math.min(value, MAX_RATING);
};

type Color = IconProps["color"];
type StarProps = {
  type: keyof typeof STAR_ICONS;
  color: Color;
};

const Star: React.FC<StarProps> = ({ type, color }) => (
  <span className={styles.StarIcon}>
    <Icon source={STAR_ICONS[type]} color={color} />
  </span>
);

/**
 * Here we want to show faded stars and text, in the case that a rating is
 * missing or not calculated yet (e.g: products with only "unpublished" reviews)
 */
const NotRatedStars = () => (
  <>
    {Array(MAX_RATING)
      .fill(EMPTY_STAR)
      .map((type, index) => (
        <Star key={index} type={type} color="subdued" />
      ))}
    <p className={styles.TextValue}>
      <TextStyle variation="subdued">(No Rating)</TextStyle>
    </p>
  </>
);

/**
 * If there is a rating value, we use this function
 * to visualize it with full and empty stars.
 * We round up to the nearest star (e.g 3.5 rating shows as 4 full stars)
 * We also show the numerical value in parenthesis
 */
type RatedStarsProps = {
  rating: number;
};
const RatedStars: React.FC<RatedStarsProps> = ({ rating }) => {
  const fullStars = Array(rating).fill(FULL_STAR);
  const starTypes = [
    ...fullStars,
    ...Array(MAX_RATING - fullStars.length).fill(EMPTY_STAR),
  ] as StarProps["type"][];
  return (
    <>
      {starTypes.map((type, index) => (
        <Star key={index} type={type} color="base" />
      ))}
      <p className={styles.TextValue}>
        <TextStyle>({rating})</TextStyle>
      </p>
    </>
  );
};

/**
 * Export the <Rating /> component
 */
type RatingProps = {
  rating: string;
};
export const Rating: React.FC<RatingProps> = ({ rating }) => {
  const number = parseInt(rating, 10);
  const hasRating = !!Number(number);
  const component = hasRating ? (
    <RatedStars rating={clampRating(number)} />
  ) : (
    <NotRatedStars />
  );
  return <div className={styles.Wrapper}>{component}</div>;
};

import { Header } from "../compornents/header";
import { TweetReview } from "../compornents/tweetReview";
import { FC } from "react";

export const Home: FC = () => {
  return (
    <>
      <Header />
      <TweetReview children="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit repellat in ad nam obcaecati quidem, necessitatibus magnam earum tempora officia iste molestiae consectetur labore vel laudantium, amet, fugiat officiis." />
      <TweetReview children="い" />
      <TweetReview children="う" />
      <TweetReview children="え" />
      <TweetReview children="お" />
      <TweetReview children="か" />
    </>
  );
};

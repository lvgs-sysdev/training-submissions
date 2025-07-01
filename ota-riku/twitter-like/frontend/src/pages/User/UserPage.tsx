import { FC } from "react";

import styles from "./UserPageStyle.module.css";

import { TweetReview } from "../../compornents/TweetReview/TweetReviewElem";
import { ProfileHeader } from "./compornents/ProfileHeader/ProfileHeaderElem";
import { ProfileBody } from "./compornents/ProfileBody/ProfileBodyElem";

type UserPageType = {
  imageFileName: string;
};

export const UserPage: FC<UserPageType> = (props) => {
  return (
    <>
      <ProfileHeader imageFileName="defaultBG.png" />
      <ProfileBody
        iconImgFileName="cat_meam.jpg"
        userName="Catmeam"
        userId="@cat_meam"
        link="www.pakupaku.com"
        followNum={53}
        followerNum={107459795}
      />
      <TweetReview>あ</TweetReview>
      <TweetReview>あ</TweetReview>
      <TweetReview>あ</TweetReview>
    </>
  );
};

import { LikeReview } from "../LikeReview/LikeReviewElem";
import { RetweetReview } from "../RetweetReview/RetweetReviewElem";
import { FC } from "react";

import styles from "./TweetReviewStyle.module.css";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../constants/IconSize";

type TweetContents = {
  //postDate: Date;
  children: string;
};

export const TweetReview: FC<TweetContents> = (props) => {
  //const { postDate } = props;
  return (
    <>
      <a className={styles["review-style"]}>
        <div className={styles["icon-style"]}>
          <ProfileIcon size={ICON_SIZES.TL} imageFileName="cat_meam.jpg" />
        </div>
        <div className={styles["main-container"]}>
          <div className={styles["username-container"]}>
            <a className={styles["username-style"]} href="#">
              Catmeam
            </a>
            <a className={styles["account-id-style"]} href="#">
              @cat_meam
            </a>
          </div>
          <div className={styles["content-container"]}>
            <h2 className={styles["content-style"]}>{props.children}</h2>
          </div>
          <div className={styles["reaction-container"]}>
            <LikeReview
              reaction={false}
              count={10}
              onImgPath="Like.png"
              offImgPath="NoLike.png"
            />
            <RetweetReview
              reaction={false}
              count={10}
              onImgPath="OnRetweet.png"
              offImgPath="OffRetweet.png"
            />
          </div>
        </div>
      </a>
    </>
  );
};

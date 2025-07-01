import { FC } from "react";
import styles from "./PostDetailStyle.module.css";

import { FollowButton } from "../../compornents/FollowButton/FollowButtonElem";
import { LikeReview } from "../../compornents/LikeReview/LikeReviewElem";
import { RetweetReview } from "../../compornents/RetweetReview/RetweetReviewElem";
import { PostDetailType } from "./PostDetailType";
import { ProfileIcon } from "../../compornents/ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../constants/IconSize";

export const PostDetailPage: FC<PostDetailType> = (props) => {
  return (
    <>
      <a className={styles["review-style"]}>
        <div className={styles["icon-style"]}>
          <ProfileIcon size={ICON_SIZES.TL} imageFileName="cat_meam.jpg" />
        </div>
        <div className={styles["main-container"]}>
          <div className={styles["post-header"]}>
            <div className={styles["username-container"]}>
              <a className={styles["username-style"]} href="#">
                Catmeam
              </a>
              <a className={styles["account-id-style"]} href="#">
                @cat_meam
              </a>
            </div>
            <FollowButton>フォローする</FollowButton>
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

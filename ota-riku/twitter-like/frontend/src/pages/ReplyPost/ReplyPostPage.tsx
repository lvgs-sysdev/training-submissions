import { FC } from "react";
import styles from "./ReplyPostStyle.module.css";
import { ReplyPostType } from "./ReplyPostType";
import { PostHeader } from "../../compornents/PostHeader/PostHeader";
import { ProfileIcon } from "../../compornents/ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../constants/IconSize";

export const ReplyPostPage: FC<ReplyPostType> = (props) => {
  const replyUserIconPath = `${process.env.PUBLIC_URL}/images/${props.replyUserIconFileName}`;
  return (
    <>
      <div className={styles["main-container"]}>
        <PostHeader />
        <article className={styles["target-post"]}>
          <div className={styles["icon-style"]}>
            <ProfileIcon size={ICON_SIZES.TL} imageFileName="cat_meam.jpg" />
          </div>
          <div>
            <div className={styles["username-container"]}>
              <a className={styles["username-style"]} href="#">
                Catmeam
              </a>
              <a className={styles["account-id-style"]} href="#">
                @cat_meam
              </a>
            </div>
            <div className={styles["target-content-container"]}>
              <h2 className={styles["target-content-style"]}>
                {props.targetPostContent}
              </h2>
            </div>
          </div>
        </article>
        <div className={styles["post-container"]}>
          <img className={styles["icon-style"]} src={replyUserIconPath} />
          <div className={styles["reply-content-container"]}>
            <div className={styles["reply-target-container"]}>
              <span className={styles["reply-target-label"]}>返信先:</span>
              <span className={styles["reply-target-id"]}>
                @{props.replyUserId}
              </span>
            </div>

            <textarea
              id="postContent"
              name="postContent"
              className={styles["post-textarea"]}
              placeholder="返信をポスト"
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

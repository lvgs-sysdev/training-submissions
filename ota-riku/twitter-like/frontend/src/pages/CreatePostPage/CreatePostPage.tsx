import { FC } from "react";
import styles from "./CreatePostStyle.module.css";

import { ProfileIcon } from "../../compornents/ProfileIcon/ProfileIcon";
import { PostHeader } from "../../compornents/PostHeader/PostHeader";
import { CreatePostType } from "./CreatePostType";
import { ICON_SIZES } from "../../constants/IconSize";

export const CratePostPage: FC<CreatePostType> = (props) => {
  return (
    <>
      <article className={styles["main-container"]}>
        <form action="/createPost" method="post">
          <PostHeader />
          <div className={styles["post-container"]}>
            <div className={styles["icon-container"]}>
              <ProfileIcon
                size={ICON_SIZES.TL}
                imageFileName={props.iconImgFileName}
              />
            </div>
            <textarea
              id="postContent"
              name="postContent"
              className={styles["post-textarea"]}
              placeholder="今どうしてる？"
            ></textarea>
          </div>
        </form>
      </article>
    </>
  );
};

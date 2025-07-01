import { FC } from "react";
import styles from "./PostHeaderStyle.module.css";
import { CancelButton } from "./compornents/CancelButton/CancelButton";
import { PostButton } from "./compornents/PostButton/PostButton";

export const PostHeader: FC = () => {
  return (
    <div className={styles["main-container"]}>
      <CancelButton />
      <PostButton />
    </div>
  );
};

import { FC } from "react";
import styles from "./PostButtonStyle.module.css";

export const PostButton: FC = () => {
  return (
    <>
      <button className={styles["post-button"]} type="submit">
        ポスト
      </button>
    </>
  );
};

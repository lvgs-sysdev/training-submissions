import { FC } from "react";
import { Reaction } from "../../types/Reaction";

import styles from "./LikeReviewStyle.module.css";

export const LikeReview: FC<Reaction> = (props) => {
  const { reaction, count, onImgPath, offImgPath } = props;

  const imgPath = reaction ? onImgPath : offImgPath;
  return (
    <>
      <div className={styles["main-container"]}>
        <button className={styles["like-button"]}>
          <img
            className={styles["like-img"]}
            src={`${process.env.PUBLIC_URL}/images/${imgPath}`}
          ></img>
        </button>
        <p className={styles["like-num"]}>{count}</p>
      </div>
    </>
  );
};

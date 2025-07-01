import React, { FC } from "react";
import { Reaction } from "../../types/Reaction";

import styles from "./RetweetReviewStyle.module.css";

export const RetweetReview: FC<Reaction> = (props) => {
  const { reaction, count, onImgPath, offImgPath } = props;

  const imgPath = reaction ? onImgPath : offImgPath;
  return (
    <>
      <div className={styles["main-container"]}>
        <button className={styles["rt-button"]}>
          <img
            className={styles["rt-img"]}
            src={`${process.env.PUBLIC_URL}/images/${imgPath}`}
          ></img>
        </button>
        <p className={styles["rt-num"]}>{count}</p>
      </div>
    </>
  );
};

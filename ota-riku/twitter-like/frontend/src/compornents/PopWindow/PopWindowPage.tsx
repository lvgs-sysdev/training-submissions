import React, { Children, FC } from "react";
import { PopWindowType } from "../../types/PopWindowType";

import styles from "./PopWindowStyle.module.css";

export const PopWindow: FC<PopWindowType> = (props) => {
  const { title } = props;

  return (
    <>
      <div className={styles.window}>
        <div className={styles["window-header"]}>
          <p className={styles["logo-text"]}>X</p>
        </div>
        <div className={styles["title-container"]}>
          <h1 className={styles["title-text"]}>{title}</h1>
        </div>
        {props.children}
      </div>
    </>
  );
};

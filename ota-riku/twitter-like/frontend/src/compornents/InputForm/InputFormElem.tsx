import React from "react";
import { FC } from "react";

import styles from "./inputFormStyle.module.css";

type SettingFormProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingInputForm: FC<SettingFormProps> = (props) => {
  const { title } = props;

  return (
    <>
      <div className={styles["window-style"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["title-text"]}>{title}</h2>
        </div>
        <div className={styles["form-container"]}>{props.children}</div>
      </div>
    </>
  );
};

import { FC } from "react";

import styles from "./EditHeaderStyle.module.css";

type EditeHeaderType = {
  imageFileName: string;
};

export const EditHeader: FC<EditeHeaderType> = (props) => {
  const imagePath = `${process.env.PUBLIC_URL}/images/${props.imageFileName}`;
  return (
    <>
      <a href="#">
        <img src={imagePath} className={styles["header-img"]} />
      </a>
    </>
  );
};

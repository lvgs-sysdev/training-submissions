import { FC } from "react";

import styles from "./ProfileHeaderStyle.module.css";

type ProfileHeaderType = {
  imageFileName: string;
};

export const ProfileHeader: FC<ProfileHeaderType> = (props) => {
  const imagePath = `${process.env.PUBLIC_URL}/images/${props.imageFileName}`;
  return (
    <>
      <img src={imagePath} className={styles["header-img"]} />
    </>
  );
};

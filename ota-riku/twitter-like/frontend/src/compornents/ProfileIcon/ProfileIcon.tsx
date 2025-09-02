import { FC } from "react";
import { ProfileIconType } from "./ProfileIconType";
import styles from "./ProfileIconStyle.module.css";

// props：Icon画像、アイコンサイズ
export const ProfileIcon: FC<ProfileIconType> = (props) => {
  const style = {
    height: `${props.size}px`,
    width: `${props.size}px`,
  };
  const imgPath = `${process.env.PUBLIC_URL}/images/Icon/${props.imageFileName}`;
  return <img src={imgPath} style={style} className={styles.border}></img>;
};

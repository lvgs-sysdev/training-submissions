import { FC } from "react";
import styles from "./HeaderStyle.module.css";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../constants/IconSize";

// TODO: アイコンのパスを指定してあげる
export const Header: FC = () => {
  return (
    <>
      <header className={styles["header-style"]}>
        <div className={styles["icon-style"]}>
          <ProfileIcon size={ICON_SIZES.REPLY} imageFileName="cat_meam.jpg" />
        </div>
        <h1 className={styles["logo-style"]}>X</h1>
        <img
          src={`${process.env.PUBLIC_URL}/images/bell.png`}
          className={styles["notificate-icon"]}
        />
      </header>
    </>
  );
};

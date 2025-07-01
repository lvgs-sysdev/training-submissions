import { FC } from "react";

import styles from "./ProfileBodyStyle.module.css";
import { FollowButton } from "../../../../compornents/FollowButton/FollowButtonElem";

import { ProfileBodyType } from "./ProfileBodyType";
import { ProfileIcon } from "../../../../compornents/ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../../../constants/IconSize";

export const ProfileBody: FC<ProfileBodyType> = (props) => {
  const imagePath = `${process.env.PUBLIC_URL}/images/${props.iconImgFileName}`;
  return (
    <>
      <div className={styles["main-container"]}>
        <div className={styles["icon-image"]}>
          <ProfileIcon size={ICON_SIZES.PROFILE} imageFileName="cat_meam.jpg" />
        </div>
        <div className={styles["profile-container"]}>
          <div className={styles["follow-button-container"]}>
            <FollowButton type="submit">フォローする</FollowButton>
          </div>
          <div className={styles["name-container"]}>
            <h1 className={styles["name-text"]}>{props.userName}</h1>
            <h2 className={styles["id-text"]}>{props.userId}</h2>
          </div>
          <div className={styles["bio-container"]}>
            <p className={styles["bio-text"]}>pakupaku!</p>
          </div>
          <div className={styles["link-container"]}>
            <img
              src={`${process.env.PUBLIC_URL}/images/link.png`}
              className={styles["link-icon"]}
            />
            <a href="#" className={styles["link-text"]}>
              {props.link}
            </a>
          </div>
          <ul className={styles["ff-list"]}>
            <li className={styles["follow-container"]}>
              <span className={styles["follow-text"]}>フォロー中</span>
              <span className={styles["follow-num-text"]}>
                {props.followNum}
              </span>
            </li>
            <li className={styles["follow-container"]}>
              <span className={styles["follow-text"]}>フォロワー</span>
              <span className={styles["follow-num-text"]}>
                {props.followerNum}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

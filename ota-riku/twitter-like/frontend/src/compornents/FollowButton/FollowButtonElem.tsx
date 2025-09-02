import { FC } from "react";
import styles from "./FollowButtonStyle.module.css";
import { FollowButtonType } from "./FollowButtonType";

export const FollowButton: FC<FollowButtonType> = (props) => {
  return (
    <>
      <button
        type={props.type}
        onClick={props.onClick}
        className={styles["follow-button"]}
      >
        {props.children}
      </button>
    </>
  );
};

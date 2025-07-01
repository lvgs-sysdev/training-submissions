import { FC } from "react";
import styles from "./CancelButtonStyle.module.css";

export const CancelButton: FC = () => {
  return (
    <>
      <a className={styles["cancel-link"]}>キャンセル</a>
    </>
  );
};

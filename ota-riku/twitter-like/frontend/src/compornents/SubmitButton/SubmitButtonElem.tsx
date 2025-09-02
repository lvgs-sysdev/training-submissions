import styles from "./SubmitButtonStyle.module.css";
import { FC } from "react";
import { SubmitButtonProps } from "./SubmitButtonType";

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  return (
    <>
      <button
        type={props.type}
        onClick={props.onClick}
        className={styles.button}
      >
        {props.children}
      </button>
    </>
  );
};

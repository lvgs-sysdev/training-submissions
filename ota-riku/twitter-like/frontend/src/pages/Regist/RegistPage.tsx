import { FC } from "react";

import styles from "./RegistStyle.module.css";

import { PopWindow } from "../../compornents/PopWindow/PopWindowPage";
import { SettingInputForm } from "../../compornents/InputForm/InputFormElem";
import { SubmitButton } from "../../compornents/SubmitButton/SubmitButtonElem";

export const Regist: FC = () => {
  return (
    <>
      <PopWindow title="アカウントを作成">
        <form action="/regist" method="post">
          <SettingInputForm title="ユーザーID">
            <input
              type="text"
              id="accountId"
              className={styles["input-style"]}
            />
          </SettingInputForm>
          <SettingInputForm title="ユーザー名">
            <input
              type="text"
              id="userName"
              className={styles["input-style"]}
            />
          </SettingInputForm>
          <SettingInputForm title="パスワード">
            <input
              type="password"
              id="password"
              className={styles["input-style"]}
            />
          </SettingInputForm>
          <SettingInputForm title="パスワード(確認用)">
            <input
              type="password"
              id="passwordConfirm"
              className={styles["input-style"]}
            />
          </SettingInputForm>
          <div className={styles["button-container-style"]}>
            <SubmitButton type="submit">作成</SubmitButton>
          </div>
        </form>
      </PopWindow>
    </>
  );
};

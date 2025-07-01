import { FC } from "react";
import styles from "./LoginStyle.module.css";

import { PopWindow } from "../../compornents/PopWindow/PopWindowPage";
import { SettingInputForm } from "../../compornents/InputForm/InputFormElem";
import { SubmitButton } from "../../compornents/SubmitButton/SubmitButtonElem";

export const Login: FC = () => {
  return (
    <>
      <PopWindow title="ログイン">
        <form>
          <SettingInputForm title="ユーザーID">
            <input
              type="text"
              id="accountId"
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
          <div className={styles["button-container-style"]}>
            <SubmitButton type="submit">ログイン</SubmitButton>
          </div>
        </form>
      </PopWindow>
    </>
  );
};

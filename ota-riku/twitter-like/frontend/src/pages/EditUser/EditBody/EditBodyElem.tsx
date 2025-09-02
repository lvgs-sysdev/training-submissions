import { FC } from "react";

import styles from "./EditBodyStyle.module.css";
import { EditBodyType } from "./EditBodyType";
import { SettingInputForm } from "../../../compornents/InputForm/InputFormElem";
import { SubmitButton } from "../../../compornents/SubmitButton/SubmitButtonElem";
import { ProfileIcon } from "../../../compornents/ProfileIcon/ProfileIcon";
import { ICON_SIZES } from "../../../constants/IconSize";

export const EditBody: FC<EditBodyType> = ({
  currentIconFileName,
  currentUserId,
  currentUserName,
  currentProfileContext,
  currentLink,
}) => {
  return (
    <>
      <div>
        <div className={styles["edit-profile-container"]}>
          <a href="#" className={styles["icon-image"]}>
            <ProfileIcon
              size={ICON_SIZES.PROFILE}
              imageFileName={currentIconFileName}
            />
          </a>
          <div className={styles["input-field-container"]}>
            <SettingInputForm title="ユーザーID">
              <input
                type="text"
                id="accountId"
                size={50}
                maxLength={20}
                className={styles["input-style"]}
                value={currentUserId}
              />
            </SettingInputForm>
            <SettingInputForm title="ユーザー名">
              <input
                type="text"
                id="userName"
                size={50}
                maxLength={50}
                className={styles["input-style"]}
                value={currentUserName}
              />
            </SettingInputForm>
            <SettingInputForm title="自己紹介文">
              <textarea
                id="bio"
                name="bio"
                className={styles["input-style"]}
                cols={50}
                rows={10}
              >
                {currentProfileContext}
              </textarea>
            </SettingInputForm>
            <SettingInputForm title="リンク">
              <input
                type="text"
                id="link"
                size={50}
                className={styles["input-style"]}
                value={currentLink}
              />
            </SettingInputForm>
            <div className={styles["button-container-style"]}>
              <SubmitButton type="submit">完了</SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

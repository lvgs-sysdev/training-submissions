import { ResponseItem } from "./responceModel.js";

import bcrypt from "bcrypt";
export default async function (userID, Password, Pool) {
  if (!userID || !Password) {
    const res = new ResponseItem({
      type: Number(401),
      message: "ユーザIDまたはパスワードが不正です。",
    });
    return res;
  }
  try {
    const [rows] = await Pool.execute(
      "SELECT password FROM users WHERE user_ID = ?",
      [userID],
    );
    const hashedPasswordInDB = rows[0].password;
    const isMatch = await bcrypt.compare(Password, hashedPasswordInDB);
    if (isMatch) {
      const [rows2] = await Pool.execute(
        "SELECT user_name FROM users WHERE user_ID = ?",
        [userID],
      );
      const res = new ResponseItem({
        type: Number(200),
        message: "ログイン成功",
        info: rows2[0].user_name,
      });
      return res;
    } else {
      const res = new ResponseItem({
        type: Number(401),
        message: "ユーザIDもしくはパスワードが間違っています",
      });
      return res;
    }
  } catch (error) {
    const res = new ResponseItem({
      type: Number(500),
      message: "データベースエラーです",
    });
    console.error(error);
    return res;
  }
}

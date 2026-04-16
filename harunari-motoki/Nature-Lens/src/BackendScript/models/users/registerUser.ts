//何をしたいのか？
// データを受け取って登録する
import { registerPool } from "./DB.ts";
import { registerSQL } from "./userSQL.ts";

export const registerUser = async (values: any) => {
  try {
    const res = await registerPool.query(registerSQL, values);
    console.log("Saved Data", res.rows[0]);
    console.log("Saved Data", res);
  } catch (error: any) {
    console.error("DataBase Error Detail", {
      message: error.message,
      code: error.code,
      detail: error.detail,
    });
    throw error;
  }
};

// //テストコード
// const testrows = ["user_id2", "user_name2", "password_hash2"];
// registerUser(testrows);

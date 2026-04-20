import { Pool } from "pg";

export const DBAccess = async (pool: Pool, SQL: string, values: any) => {
  try {
    const res = await pool.query(SQL, values);
    console.log("Saved Data", res.rows[0]);
    const queryResult = res.rows[0];
    return queryResult;
  } catch (error: any) {
    console.error("DataBase Error Detail", {
      message: error.message,
      code: error.code,
      detail: error.detail,
    });
    throw error;
  }
};

// // //テストコード
// import { usersPool } from "./DB";
// import { loginSQL } from "./userSQL";
// const testrows = ["user_id2"];

// DBAccess(usersPool, loginSQL, testrows);

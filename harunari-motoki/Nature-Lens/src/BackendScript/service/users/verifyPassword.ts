import * as argon2 from "argon2";

export const verifyPassword = async (
  db_hash: string,
  password: string,
): Promise<boolean> => {
  try {
    console.log("db_hashは", db_hash, "passwordは", password);
    const isMatch = await argon2.verify(db_hash, password);
    console.log("verifyingの結果", isMatch);
    return isMatch;
  } catch (error: any) {
    console.error("varify password error", error);
    throw error;
  }
};

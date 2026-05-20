//バリデーション結果の型定義

interface ValidationResult {
  isValid: boolean;
  message: string;
}

//メールアドレスチェック

export const validateEmail = (email: string): ValidationResult => {
  if (!email)
    return { isValid: false, message: "メールアドレスを入力してください" };
  if (!email.includes("@")) {
    return {
      isValid: false,
      message: "有効なメールアドレスを入力してください",
    };
  }
  return { isValid: true, message: "" };
};

//パスワードチェック

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 8) {
    return { isValid: false, message: "パスワードは8文字以上必要です" };
  }
  return { isValid: true, message: "" };
};

//ユーザーidの文字数チェック

export const validateAccountId = (accountId: string): ValidationResult => {
  if (accountId.length < 3) {
    return {
      isValid: false,
      message: "ユーザーIDは3文字以上で入力してください",
    };
  }
  return { isValid: true, message: "" };
};

//ユーザー名のチェック
export const validateAccountName = (accountName: string): ValidationResult => {
  if (!accountName.trim())
    return { isValid: false, message: "ユーザー名を入力してください。" };
  return { isValid: true, message: "" };
};

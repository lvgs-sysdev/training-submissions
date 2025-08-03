// パスワード：半角英数記号のみを使用し、3種類以上含む8文字以上
export const passwordValidation = (value: string) => {
  // ① 使用不可な文字（半角英数記号以外）が含まれていないかチェック
  if (!/^[ -~]+$/.test(value)) {
    return "パスワードは半角の英大文字、小文字、数字、記号のみ使用できます";
  }

  // ② 長さのチェック
  if (value.length < 8) {
    return "8文字以上で入力してください";
  }

  // ③ 複雑性（文字種）のチェック
  let count = 0;
  if (/[A-Z]/.test(value)) count++; // 英大文字
  if (/[a-z]/.test(value)) count++; // 英小文字
  if (/\d/.test(value)) count++; // 数字
  if (/[^A-Za-z0-9]/.test(value)) count++; // 記号

  if (count < 3) {
    return "英大文字、小文字、数字、記号のうち3種類以上を含めてください";
  }

  return true;
};

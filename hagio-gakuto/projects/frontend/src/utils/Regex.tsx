// パスワード：3種以上含む8文字以上
export const passwordValidation = (value: string) => {
  let count = 0;
  if (/[A-Z]/.test(value)) count++;
  if (/[a-z]/.test(value)) count++;
  if (/\d/.test(value)) count++;
  if (/[^A-Za-z0-9]/.test(value)) count++;
  if (value.length < 8) return "8文字以上必要です";
  if (count < 3)
    return "英大文字・小文字・数字・記号のうち3種類以上含めてください";
  return true;
};

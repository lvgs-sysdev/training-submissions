/**
 * 建築日から築年数を計算して文字列を返す
 * @param buildDate - 建築日 (Dateオブジェクトまたは日付文字列)
 * @returns {string} - "新築", "建築中", または "〇年" という文字列
 */
export function calculateBuildingAge(buildDate: Date) {
  const build = new Date(buildDate);
  const now = new Date();

  // 建築日が未来の場合は「建築中」
  if (build > now) {
    return "建築中";
  }

  // 年の差を計算
  let age = now.getFullYear() - build.getFullYear();

  // 誕生日がまだ来ていない場合（月や日を比較）は1歳引く
  const monthDiff = now.getMonth() - build.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < build.getDate())) {
    age--;
  }

  // 築1年未満は「新築」と表示
  if (age < 1) {
    return "新築";
  }

  return `${age}年`;
}

/**
 * Dateオブジェクトまたは日付文字列を「YYYY年M月D日」形式の文字列に変換する
 * @param date - 変換対象の日付
 * @returns {string} - フォーマットされた日付文字列 (例: "2025年4月1日")
 */
export function formatDateToYMD(date: Date | string): string {
  if (!date) return "";
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // getMonth()は0から始まるため+1する
  const day = dateObj.getDate();
  return `${year}年${month}月${day}日`;
}

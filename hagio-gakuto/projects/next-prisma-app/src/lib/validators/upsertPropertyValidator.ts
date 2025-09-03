import { z } from "zod";

// YYYY/MM/DD形式の文字列を検証し、有効な日付であればDateオブジェクトに変換するカスタムスキーマ
const dateSchema = z
  .string()
  .nonempty("建築日は必須です")
  .refine((date) => /^\d{4}\/\d{2}\/\d{2}$/.test(date), {
    message: "YYYY/MM/DD形式で入力してください",
  })
  .refine(
    (date) => {
      const d = new Date(date);
      const [year, month, day] = date.split("/").map(Number);
      // Dateオブジェクトが自動補正していないか、年月日までチェック
      return (
        !isNaN(d.getTime()) &&
        d.getFullYear() === year &&
        d.getMonth() + 1 === month &&
        d.getDate() === day
      );
    },
    {
      message: "有効な日付を入力してください",
    }
  )
  .transform((date) => new Date(date)); // 検証後、Dateオブジェクトに変換

/**
 * 物件登録・編集フォームのバリデーションスキーマ
 */
export const UpsertPropertySchema = z.object({
  // 基本情報
  name: z
    .string()
    .nonempty("物件名は必須です")
    .max(100, "100文字以下で入力してください"),
  propertyTypeId: z.string().nonempty("物件種別は必須です"), // Server Actionでnumberに変換
  priceRent: z.coerce
    .number({ message: "半角数字で入力してください" })
    .min(1, "家賃は必須です")
    .max(999999999, "9桁以下で入力してください"),

  // 住所
  zipcode: z
    .string()
    .nonempty("郵便番号は必須です")
    .length(7, "7文字で入力してください")
    .regex(/^\d+$/, "郵便番号は半角数字で入力してください"),
  prefecture: z.string().nonempty("都道府県は必須です").min(2).max(10),
  city: z.string().nonempty("市区は必須です").min(1).max(20),
  town: z.string().nonempty("町名は必須です").max(50),
  chome: z.coerce.number({ message: "丁目は半角数字で入力してください" }),
  block: z.coerce.number({ message: "番地は半角数字で入力してください" }),
  building: z
    .string()
    .max(100, "100文字以下で入力してください")
    .optional()
    .nullable(),
  roomNumber: z
    .string()
    .max(20, "20文字以下で入力してください")
    .optional()
    .nullable(),

  // 詳細情報
  nearestStation: z.string().nonempty("最寄り駅は必須です").max(100),
  walkToStation: z.coerce
    .number({ message: "半角数字で入力してください" })
    .min(1, "駅徒歩は必須です")
    .max(999),
  areaSqm: z.coerce
    .number({ message: "半角数字か小数で入力してください" })
    .min(0.1, "面積は必須です"),
  type: z.string().nonempty("物件種別は必須です"),
  layout: z.string().nonempty("間取りは必須です"),
  buildDate: dateSchema,
  floor: z.coerce
    .number({ message: "半角数字で入力してください" })
    .min(1, "階数は必須です")
    .max(999),
  totalFloors: z.coerce
    .number({ message: "半角数字で入力してください" })
    .min(1, "総階数は必須です")
    .max(999),
  isEmpty: z.coerce.boolean(), // "true" or "false"の文字列をbooleanに変換
});

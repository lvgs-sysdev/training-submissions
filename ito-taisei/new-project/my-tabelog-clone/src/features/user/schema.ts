import { z } from "zod";

export const restaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "店名は必須です")
    .max(50, "店名は50文字以内で入力してください"),
  address: z
    .string()
    .trim()
    .min(1, "住所は必須です")
    .max(100, "住所は100文字以内で入力してください"),
  genre_id: z.coerce.number().int().positive("ジャンルを選択してください"),

  station_id: z
    .union([
      z.coerce.number().int().positive(),
      z.string().length(0),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;

import { z } from "zod";

export const InquiryPropertySchema = z.object({
  inquiryCategoryId: z.coerce
    .number()
    .int()
    .min(1, "お問い合わせ内容は必須です"),
  unitIds: z
    .array(z.coerce.number().int())
    .min(1, "物件を1件以上選択してください。"),
});

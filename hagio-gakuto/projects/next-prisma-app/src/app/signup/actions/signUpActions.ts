"use server";

import { RegisterSchema } from "@/lib/validators/user";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface FormState {
  message: string | null;
}

export async function signUpAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = RegisterSchema.safeParse(raw);
  if (!result.success) {
    return { message: "入力内容に誤りがあります" };
  }
  const { name, email, password } = result.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { message: "すでに登録済みです" };
  }
  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });
  return { message: "登録が完了しました" };
}

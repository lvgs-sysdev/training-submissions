import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { SignUpSchema } from "@/lib/validators/signUpValidator";
import { z } from "zod";
import { sendWelcomeEmail } from "./emailService";

// Zodスキーマから型を推論
type SignUpData = z.infer<typeof SignUpSchema>;

export async function createUser(data: SignUpData) {
  const { name, email, password } = data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error("すでに登録済みです");
  }

  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  await sendWelcomeEmail(email, name);
}

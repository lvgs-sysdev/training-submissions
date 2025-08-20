import { createUser } from "./signUpService";
import { prisma } from "@/lib/prisma"; // これは自動的にモックに置き換わる
import { DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// モックされたprismaの型を定義
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("createUser", () => {
  it("新しいユーザーを正常に作成できること", async () => {
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    // 1. 準備: prisma.user.findUniqueがnullを返すように設定
    prismaMock.user.findUnique.mockResolvedValue(null);

    // 2. 実行: createUserサービスを呼び出す
    await createUser(newUser);

    // 3. 検証: prisma.user.createが正しいデータで呼ばれたか確認
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: expect.any(String), // パスワードはハッシュ化されているはず
      },
    });
  });

  //   it("すでに登録済みのメールアドレスの場合はエラーを投げること", async () => {
  //     const existingUser = {
  //       name: "Existing User",
  //       email: "exists@example.com",
  //       password: "password123",
  //     };

  //     // 1. 準備: prisma.user.findUniqueがユーザーオブジェクトを返すように設定
  //     prismaMock.user.findUnique.mockResolvedValue({
  //       id: 1,
  //       ...existingUser,
  //       createdAt: new Date(),
  //     });

  //     // 2. 実行と検証: createUserがエラーを投げることを確認
  //     await expect(createUser(existingUser)).rejects.toThrow(
  //       "すでに登録済みです"
  //     );
  //   });
});

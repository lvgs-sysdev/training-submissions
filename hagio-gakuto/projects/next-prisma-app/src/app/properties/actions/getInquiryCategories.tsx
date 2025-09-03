"use server";

import { prisma } from "@/lib/prisma";

/**
 * データベースから問い合わせカテゴリの一覧を取得するServer Action
 */
export async function getInquiryCategories() {
  try {
    const categories = await prisma.inquiryCategory.findMany({
      orderBy: { id: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch inquiry categories:", error);
    // エラーが発生した場合は空の配列を返すか、エラーをスローする
    return [];
  }
}

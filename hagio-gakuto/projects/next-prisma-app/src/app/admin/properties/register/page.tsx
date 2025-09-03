import { prisma } from "@/lib/prisma";
import PropertyUpsertForm from "../components/UpsertForm";
import { Metadata } from "next";

/**
 * 物件登録・編集ページのサーバーコンポーネント
 * ここでDBからマスターデータを取得し、クライアントコンポーネントに渡す
 */
export const metadata: Metadata = {
  title: "物件管理",
};

export default async function PropertyUpsertPage() {
  // サーバーサイドで並列にデータを取得
  const [propertyTypes, layouts] = await Promise.all([
    prisma.propertyType.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.layout.findMany({
      orderBy: { id: "asc" },
    }),
  ]);

  // 取得したデータをクライアントコンポーネントのFormに渡す
  return <PropertyUpsertForm propertyTypes={propertyTypes} layouts={layouts} />;
}

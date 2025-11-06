"use client";

import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Error({ msg }: { msg?: string }) {
  if (!!msg) {
    toast(msg, {
      description: "",
      action: {
        label: "閉じる",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-red-50 border border-red-200 rounded-lg m-10">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          データの読み込みに失敗しました
        </h1>
        <p className="text-gray-600 text-center mb-4">
          コース情報を取得できませんでした。時間をおいて再度お試しください。
        </p>
      </div>
    </>
  );
}

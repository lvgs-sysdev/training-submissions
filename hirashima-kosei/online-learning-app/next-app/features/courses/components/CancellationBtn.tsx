"use client";

import { toast } from "sonner";
import { axiosClient } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CancellationBtn({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  const router = useRouter();

  const handleCancellation = async () => {
    try {
      await axiosClient.delete("/course", {
        data: { userId, courseId },
      });

      toast(`コースの登録を解除しました。`, {
        description: "",
        action: {
          label: "ホームに戻る",
          onClick: () => router.push("/"),
        },
      });
    } catch (err: any) {
      toast(`エラーが発生しました。：${err.msg}`, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => console.log("undo"),
        },
      });
    }
  };
  return (
    <Button onClick={() => handleCancellation()}>コースの登録を解除</Button>
  );
}

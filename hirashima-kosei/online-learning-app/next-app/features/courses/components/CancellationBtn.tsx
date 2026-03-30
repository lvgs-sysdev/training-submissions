"use client";

import { toast } from "sonner";
import { axiosClient } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CancellationBtn({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      toast(errorMessage, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => setError(false),
        },
      });
    }
  }, [error]);

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
      setErrorMessage(`エラーが発生しました。：${err.msg}`);
      setError(true);
    }
  };
  return (
    <Button onClick={() => handleCancellation()}>コースの登録を解除</Button>
  );
}

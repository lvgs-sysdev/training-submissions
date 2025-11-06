"use client";

import { Toggle } from "@/components/ui/toggle";
import { axiosClient } from "@/lib/api/api-client";
import { StarIcon } from "lucide-react";

export default function Star({
  courseId,
  isStar,
  userId,
}: {
  courseId: number;
  isStar: boolean;
  userId: string;
}) {
  const handlePressStar = async (pressed: boolean) => {
    await axiosClient.put("/course/star", { courseId, pressed, userId });
  };
  return (
    <Toggle
      aria-label="Toggle star"
      size="sm"
      variant="outline"
      defaultPressed={isStar}
      onPressedChange={(pressed) => handlePressStar(pressed)}
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
    >
      <StarIcon />
      お気に入り
    </Toggle>
  );
}

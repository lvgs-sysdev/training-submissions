import { ReactNode } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { CourseItem } from "@/types";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { axiosClient } from "@/lib/api/api-client";
import { redirect } from "next/navigation";

export default function HoverItemCard({
  children,
  courseItem,
}: {
  children: ReactNode;
  courseItem: CourseItem;
}) {
  const { userState } = useAuth();

  const handleRegister = async () => {
    if (!userState) {
      toast(`コースを登録するにはログインしてください。`, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => console.log("undo"),
        },
      });
      return;
    }

    try {
      await axiosClient.post("/course", {
        userId: userState.userId,
        courseId: courseItem.id,
      });
    } catch (err: any) {
      if (err.status === 409) {
        redirect(`/myLearning/${userState.userId}/${courseItem.id}`);
      }
      toast(`登録中にエラーが発生しました。：${err.msg}`, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => console.log("undo"),
        },
      });
      return;
    }

    redirect(`/myLearning/${userState.userId}`);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="bg-white p-2">
        <div className="flex-col justify-between mx-auto space-y-3">
          <h1 className="text-sm font-semibold line-clamp-2">
            {courseItem.course_name}
          </h1>
          <p className="text-sm line-clamp-2">
            {courseItem.course_description}
          </p>
          <p className="text-sm line-clamp-2">{courseItem.user_name}</p>
          <p className="text-muted-foreground text-xs">
            {courseItem.updated_at?.slice(0, 10)}
          </p>
          {
            <Button className="w-full" onClick={() => handleRegister()}>
              受講する
            </Button>
          }
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

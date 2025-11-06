"use client";

import { Button } from "@/components/ui/button";
import ShowBlobData from "@/features/courses/components/showBlobData";
import { CourseItem } from "@/types";
import ToggleList from "./toggleList";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { axiosClient } from "@/lib/api/api-client";
import { redirect } from "next/navigation";

export default function CourseDetailPage({
  courseData,
}: {
  courseData: CourseItem;
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
        courseId: courseData.id,
      });
    } catch (err: any) {
      if (err.status === 409) {
        redirect(`/myLearning/${userState.userId}/${courseData.id}`);
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
    <>
      <section>
        <div className="bg-black text-white">
          <div className="container mx-auto">
            <div className="max-w-[80rem] mx-auto md:flex flex-start justify-between gap-10 sm:grid p-4">
              <div className="space-y-5  pt-5">
                <h1 className="text-2xl">{courseData?.course_name}</h1>
                <p>{courseData?.course_description}</p>
              </div>
              <div className="mt-10 p-1 md:max-w-[20rem] md:w-fit space-y-2 bg-white text-black shadow-md shadow-zinc-500">
                <ShowBlobData
                  bufferData={courseData?.thumbnail!}
                  className="w-full h-auto mx-auto"
                />
                <div className="flex flex-col gap-2">
                  <p className="break-words">{courseData?.course_name}</p>
                  <p className="break-words">
                    {courseData?.course_description}
                  </p>
                  <p className="break-words">{courseData?.user_name}</p>
                  <p className="break-words">
                    {courseData?.updated_at?.slice(0, 10)}
                  </p>
                  <Button
                    className="w-full bg-white text-black border hover:bg-gray-300"
                    onClick={() => handleRegister()}
                  >
                    受講する
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto mt-10">
          <div className="max-w-[80rem] mx-auto p-4">
            <h2 className="text-2xl mb-5">コースの内容</h2>
            <ToggleList courseId={courseData.id} />
          </div>
        </div>
      </section>
    </>
  );
}

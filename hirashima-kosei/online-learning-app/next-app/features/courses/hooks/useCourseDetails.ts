import { useState } from "react";
import { CourseDetails } from "@/types";
import { axiosClient } from "@/lib/api/api-client";
import { toast } from "sonner";

export default function useCourseDetails() {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null
  );

  const fetchCourseDetails = async (courseId: number) => {
    try {
      const response = await axiosClient.get("/course/details", {
        params: { courseId },
      });
      setCourseDetails(response.data.courseDetails);
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

  return { courseDetails, fetchCourseDetails };
}

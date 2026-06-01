import { useState } from "react";
import { CourseDetails } from "@/types";
import { axiosClient } from "@/lib/api/api-client";

export default function useCourseDetails() {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null
  );
  const [error, setError] = useState<boolean>(false);

  const fetchCourseDetails = async (courseId: number) => {
    try {
      const response = await axiosClient.get("/course/details", {
        params: { courseId },
      });
      setCourseDetails(response.data.courseDetails);
    } catch (err: any) {
      setError(true);
    }
  };

  return { courseDetails, fetchCourseDetails, error, setError };
}

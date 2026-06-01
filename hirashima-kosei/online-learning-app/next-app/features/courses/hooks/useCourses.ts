import { axiosClient } from "@/lib/api/api-client";
import { CourseItems } from "@/types";
import { useState } from "react";

export default function useCourses() {
  const [courses, setCourses] = useState<CourseItems>();
  const [error, setError] = useState<boolean>(false);

  const fetchCourses = async (
    userId: string = "",
    orderByRating: boolean = false,
    filteredByFavorite: boolean = false
  ) => {
    try {
      const response = await axiosClient.get("/course", {
        params: {
          userId,
          orderByRating,
          filteredByFavorite,
        },
      });
      const courses = response.data.courses;
      setCourses(courses);
    } catch (err: any) {
      setError(true);
    }
  };

  return { courses, fetchCourses, error, setError };
}

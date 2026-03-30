import { axiosServerClient } from "@/lib/api/api-client";

export const fetchCourses = async (
  userId?: string,
  orderByRating: boolean = false,
  filteredByFavorite: boolean = false
) => {
  try {
    const response = await axiosServerClient.get("/course", {
      params: {
        userId,
        orderByRating,
        filteredByFavorite,
      },
    });
    const courses = response.data.courses;
    return courses;
  } catch (err: any) {
    throw err;
  }
};

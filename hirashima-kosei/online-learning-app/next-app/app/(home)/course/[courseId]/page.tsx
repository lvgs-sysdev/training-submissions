import { cookies } from "next/headers";
import { axiosServerClient } from "@/lib/api/api-client";
import { redirect } from "next/navigation";
import CourseDetailPage from "@/features/courses/components/CourseDetailPage";
import ErrorPage from "@/components/ErrorPage";

export default async function Course({
  params,
}: PageProps<'/course/[courseId]'>) {
  const { courseId } = await params;
  const sessionId = (await cookies()).get("session")?.value;

  if (!!sessionId) {
    let courseData;
    let userId;
    try {
      userId = (
        await axiosServerClient.post("/user", {
          sessionId,
        })
      ).data.loginUser.userId;

      courseData = (
        await axiosServerClient.get("/course/selected", {
          params: {
            userId,
            courseId,
          },
        })
      ).data.course;
    } catch (err) {
      console.log(err);
      return <ErrorPage />;
    }
    if (courseData.isEnrollment) {
      redirect(`/myLearning/${userId}/${courseId}`);
    }
    return <CourseDetailPage courseData={courseData} />;
  }

  try {
    const courseData = (
      await axiosServerClient.get("/course/selected", {
        params: {
          courseId,
        },
      })
    ).data.course;

    return <CourseDetailPage courseData={courseData} />;
  } catch (err) {
    console.log(err);
    return <ErrorPage />;
  }
}

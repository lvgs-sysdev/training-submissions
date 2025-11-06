import { axiosServerClient } from "@/lib/api/api-client";
import EditLecturePage from "@/features/lectures/components/EditLecturePage";

export default async function ({ params }: PageProps<'/lecture/[courseId]'>) {
  const { courseId } = await params;

  try {
    const lectureData = (
      await axiosServerClient.get("/lecture/course/selected", {
        params: { courseId },
      })
    ).data;

    return <EditLecturePage existingLectureData={lectureData} />;
  } catch (err) {
    throw err;
  }
}

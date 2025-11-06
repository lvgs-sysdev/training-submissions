import { axiosServerClient } from "@/lib/api/api-client";
import { redirect } from "next/navigation";
import ErrorPage from "@/components/ErrorPage";

export default async function MyLearningPage({
  params,
}: PageProps<'/myLearning/[userId]/[courseId]'>) {
  const { userId, courseId } = await params;

  try {
    const { courseDetails, completedContentIdRow } = (
      await axiosServerClient.get("/course/details", {
        params: { courseId, userId },
      })
    ).data;

    if (!completedContentIdRow || completedContentIdRow.length === 0) {
      if (!courseDetails || courseDetails.length === 0)
        return <ErrorPage msg={"コンテンツが存在しません。"} />;
      redirect(
        `/myLearning/${userId}/${courseId}/${
          JSON.parse(courseDetails[0].contents)[0].content_id
        }`
      );
    }
    redirect(`/myLearning/${userId}/${courseId}/${completedContentIdRow[0]}`);
  } catch (err) {
    throw err;
  }
}

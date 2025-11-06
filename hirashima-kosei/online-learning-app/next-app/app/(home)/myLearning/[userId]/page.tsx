import MyLearningPage from "@/features/courses/components/MyLearningPage";
import { fetchCourses } from "@/services/course";
import { CourseItems } from "@/types";
import Error from "@/components/ErrorPage";
import Link from "next/link";

export default async function MyLearning({
  params,
}: PageProps<'/myLearning/[userId]'>) {
  const { userId } = await params;
  let courses: CourseItems | null = null;
  let courseFetchFlg = false;

  try {
    courses = await fetchCourses(userId);
  } catch (err) {
    courseFetchFlg = true;
    console.log(err);
  }

  if (courseFetchFlg) {
    return <Error />;
  }

  if (!courses || courses.length === 0) {
    return (
      <>
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-8 text-center">
          <p className="text-2xl">
            受講しているコースがありません。
            <Link href="/" className="underline">
              新しいコースを探す。
            </Link>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <MyLearningPage courseItems={courses} userId={userId} />
    </>
  );
}

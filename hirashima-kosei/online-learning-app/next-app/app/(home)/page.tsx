import { fetchCourses } from "@/services/course";
import { CarouselCardList } from "@/features/courses/components/CardList";
import { CourseItems } from "@/types";
import Error from "@/components/ErrorPage";

export default async function Home() {
  let courses: CourseItems | null = null;
  let popularCourses: CourseItems | null = null;
  let courseFetchFlg = false;

  try {
    courses = await fetchCourses();
    popularCourses = await fetchCourses();
  } catch (err) {
    courseFetchFlg = true;
    console.log(err);
  }

  if (
    courseFetchFlg ||
    !courses ||
    courses.length === 0 ||
    !popularCourses ||
    popularCourses.length === 0
  ) {
    return <Error />;
  }

  return (
    <>
      <section className="p-4">
        <div className="container mx-auto">
          <div className="divide-y space-y-5">
            <div className="p-10 xl:p-9">
              <p className="text-xl mb-2">新着コース</p>
              <CarouselCardList courseItems={courses} />
            </div>
            <div className="p-10 xl:p-9">
              <p className="text-xl mb-2">人気のコース</p>
              <CarouselCardList courseItems={popularCourses} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

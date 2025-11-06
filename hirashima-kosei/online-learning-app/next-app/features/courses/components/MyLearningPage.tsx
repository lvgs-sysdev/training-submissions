"use client";

import useSelectableTab from "@/features/courses/hooks/useSelectableTab";
import MyAllLearningList from "@/features/courses/components/MyAllLearningList";
import MyFavoriteList from "@/features/courses/components/MyFavoriteList";
import { CourseItems } from "@/types";
import useCourses from "../hooks/useCourses";

export default function MyLearningPage({
  courseItems,
  userId,
}: {
  courseItems: CourseItems;
  userId: string;
}) {
  const { selectedType, setSelectedType } = useSelectableTab();

  const selectedStyle = "pt-3 border-b-5 border-white";
  const notSelectedStyle = "pt-3";

  const { courses, fetchCourses, error } = useCourses();
  const executeFetchCourses = async () => {
    !!userId && (await fetchCourses(userId, false, true));
  };

  return (
    <>
      <section>
        <div className="bg-black text-white pb-0">
          <div className="container mx-auto pt-5 p-4 pb-0">
            <h1 className="text-4xl">マイラーニング</h1>
            <div className="flex flex-start gap-10">
              {selectedType === "all" ? (
                <>
                  <button
                    className={selectedStyle}
                    onClick={() => {
                      setSelectedType("all");
                    }}
                  >
                    すべてのコース
                  </button>
                  <button
                    className={notSelectedStyle}
                    onClick={async () => {
                      await executeFetchCourses();
                      setSelectedType("favorite");
                    }}
                  >
                    お気に入りのコース
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={notSelectedStyle}
                    onClick={() => {
                      setSelectedType("all");
                    }}
                  >
                    すべてのコース
                  </button>
                  <button
                    className={selectedStyle}
                    onClick={async () => {
                      await executeFetchCourses();
                      setSelectedType("favorite");
                    }}
                  >
                    お気に入りのコース
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <section className="p-4">
          <div className="container mx-auto">
            <div className="divide-y space-y-5">
              <div className="p-10 xl:p-9">
                <p className="text-xl mb-2">コース一覧</p>
                {selectedType === "all" && (
                  <MyAllLearningList courseItems={courseItems} />
                )}
                {selectedType === "favorite" && (
                  <MyFavoriteList favoriteCourses={courses!} error={error} />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

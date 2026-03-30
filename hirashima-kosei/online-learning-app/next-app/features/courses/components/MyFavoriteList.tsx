import ErrorPage from "@/components/ErrorPage";
import { PaginationCardList } from "./CardList";
import { CourseItems } from "@/types";

export default function MyFavoriteList({
  favoriteCourses,
  error,
}: {
  favoriteCourses: CourseItems;
  error: boolean;
}) {
  return (
    <>
      {error && <ErrorPage />}
      {!error && (
        <PaginationCardList courseItems={favoriteCourses} itemsPerPage={8} />
      )}
    </>
  );
}

import { CourseItems } from "@/types";
import { PaginationCardList } from "./CardList";

export default function MyLectureList({ courses }: { courses: CourseItems }) {
  return (
    <>
      <PaginationCardList
        courseItems={courses!}
        itemsPerPage={8}
        isLecture={true}
      />
    </>
  );
}

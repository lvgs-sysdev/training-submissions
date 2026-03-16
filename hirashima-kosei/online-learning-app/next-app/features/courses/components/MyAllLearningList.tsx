import { PaginationCardList } from "./CardList";
import { CourseItems } from "@/types/index.js";

export default function MyAllLearningList({
  courseItems,
}: {
  courseItems: CourseItems;
}) {
  return (
    <>
      <PaginationCardList courseItems={courseItems} itemsPerPage={8} />
    </>
  );
}

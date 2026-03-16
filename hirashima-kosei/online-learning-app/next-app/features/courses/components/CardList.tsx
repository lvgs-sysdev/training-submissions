"use client";

import ItemCard from "./ItemCard";
import { CourseItem, CourseItems } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import DynamicPagination from "./DynamicPagination";

export function CarouselCardList({
  courseItems,
}: {
  courseItems: CourseItems;
}) {
  return (
    <Carousel className="mx-auto">
      <CarouselContent>
        {courseItems?.map((item: CourseItem, idx: number) => {
          return (
            <CarouselItem key={idx} className="md:basis-1/3 xl:basis-1/6">
              <ItemCard courseItem={item} />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function PaginationCardList({
  courseItems,
  itemsPerPage,
  isLecture = false,
}: {
  courseItems: CourseItems;
  itemsPerPage: number;
  isLecture?: boolean;
}) {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [displayData, setDisplayData] = useState<CourseItems>(
    courseItems?.slice(
      0,
      itemsPerPage > courseItems?.length ? courseItems?.length : itemsPerPage
    )
  );

  const totalPages = Math.ceil(courseItems?.length / itemsPerPage);

  const handleClickPageNum = (pageNum: number) => {
    setCurrentPageNum(pageNum);

    const starDataIdx = (pageNum - 1) * itemsPerPage;
    const endDataIdx =
      courseItems?.length > starDataIdx + itemsPerPage
        ? starDataIdx + itemsPerPage
        : courseItems?.length;

    setDisplayData(courseItems?.slice(starDataIdx, endDataIdx));
  };

  if (totalPages <= 1) {
    return (
      <>
        <div className="flex flex-wrap mb-10 gap-15">
          {displayData?.map((item: CourseItem, idx: number) => {
            return (
              <div key={idx} className="w-80">
                <ItemCard courseItem={item} isLecture={isLecture} />
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap mb-10 gap-15">
        {displayData?.map((item: CourseItem, idx: number) => {
          return (
            <div key={idx} className="w-80">
              <ItemCard courseItem={item} isLecture={true} />
            </div>
          );
        })}
      </div>

      <DynamicPagination
        currentPageNum={currentPageNum}
        totalPages={totalPages}
        handleClickPageNum={handleClickPageNum}
      />
    </>
  );
}

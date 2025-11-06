"use client";

import { useState, useEffect } from "react";
import useCourseDetails from "../hooks/useCourseDetails";
import ToggleItem from "./toggleItem";

export default function ToggleList({ courseId }: { courseId: number }) {
  const { courseDetails, fetchCourseDetails } = useCourseDetails();

  const [isOpenAllDetails, setIsOpenAllDetails] = useState<boolean>(false);

  useEffect(() => {
    const executeFetchCourseDetails = async () =>
      await fetchCourseDetails(courseId);
    executeFetchCourseDetails();
  }, []);

  return (
    <>
      <table className="w-full">
        <thead className="flex justify-between">
          <tr>
            <th>
              <p className="text-md">セクションの数:・レクチャーの数:</p>
            </th>
          </tr>
          <tr>
            <th>
              <button
                className="text-lg text-blue-500 hover:underline"
                onClick={() => setIsOpenAllDetails(!isOpenAllDetails)}
              >
                すべてのセクションを表示
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {courseDetails?.map((item, idx) => {
            return (
              <ToggleItem
                key={idx}
                courseDetail={item}
                isOpenAllDetails={isOpenAllDetails}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}

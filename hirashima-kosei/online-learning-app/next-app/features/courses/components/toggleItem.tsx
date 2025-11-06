import { CourseDetail } from "@/types";
import { useState } from "react";

export default function ToggleItem({
  courseDetail,
  isOpenAllDetails,
}: {
  courseDetail: CourseDetail;
  isOpenAllDetails: boolean;
}) {
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);

  return (
    <>
      <tr className="border bg-gray-100">
        <td className="py-2 ps-2">
          <button onClick={() => setIsOpenDetails(!isOpenDetails)}>
            {isOpenAllDetails || isOpenDetails
              ? `▲ ${courseDetail.section_name}`
              : `▼ ${courseDetail.section_name}`}
          </button>
        </td>
      </tr>
      {(isOpenAllDetails || isOpenDetails) &&
        JSON.parse(courseDetail.contents).map((item: any, idx: number) => {
          return (
            <tr key={idx} className="border">
              <td className="py-2 ps-2">
                {item["content_name"]
                  ? item["content_name"]
                  : "コンテンツがありません"}
              </td>
            </tr>
          );
        })}
    </>
  );
}

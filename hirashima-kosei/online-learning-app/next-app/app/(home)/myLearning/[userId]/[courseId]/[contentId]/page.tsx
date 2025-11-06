import CancellationBtn from "@/features/courses/components/CancellationBtn";
import { axiosServerClient } from "@/lib/api/api-client";
import { Content, CourseDetail, CourseDetails, CourseItem } from "@/types";
import Link from "next/link";
import React from "react";
import ContentArea from "@/features/courses/components/content/ContentArea";
import Star from "@/features/courses/components/Star";
import ErrorPage from "@/components/ErrorPage";

export default async function SelectedContentPage({
  params,
}: PageProps<'/myLearning/[userId]/[courseId]/[contentId]'>) {
  const { userId, courseId, contentId } = await params;

  let courseItem: CourseItem;
  let courseDetails: CourseDetails;
  let completedContentIdRow: number[];

  try {
    courseItem = (
      await axiosServerClient.get("/course/selected", {
        params: { courseId, userId },
      })
    ).data.course;

    const data = (
      await axiosServerClient.get("/course/details", {
        params: { courseId, userId },
      })
    ).data;

    courseDetails = data.courseDetails;
    completedContentIdRow = data.completedContentIdRow;

    await axiosServerClient.put("/course/details/complete", {
      userId,
      contentId,
    });
  } catch (err) {
    console.log(err);
    return <ErrorPage />;
  }

  return (
    <>
      <section className="bg-black">
        <div className="container mx-auto flex justify-between items-center pt-2 pb-2">
          <div className="md:w-1/20 text-gray-200 pe-2 pt-2 pb-2 border-r">
            <Link href={"/"} className="md:text-md hover:underline">
              ホームへ
            </Link>
          </div>
          <div className="md:w-19/20 text-gray-200 p-2">
            <p className="md:text-md">{courseItem.course_name}</p>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto flex justify-between items-center">
          <div className="md:flex justify-between w-full">
            <div className="md:w-2/3">
              <div className="border w-full aspect-[16/9] md:h-150 mb-5">
                <ContentArea contentId={contentId} />
              </div>
              <div>
                <div className="flex justify-between">
                  <p className="text-xl">{courseItem.course_name}</p>
                  <Star
                    courseId={courseItem.id}
                    isStar={courseItem.isStar!}
                    userId={userId}
                  />
                </div>
              </div>
              <div>{courseItem.course_description}</div>
              <div className="flex flex-col items-end pt-10">
                <CancellationBtn userId={userId} courseId={courseId} />
              </div>
            </div>
            <div className="md:w-1/3 ">
              <table className="w-full">
                <thead>
                  <tr className="border text-left">
                    <th className="p-2">コースの内容</th>
                  </tr>
                </thead>
                <tbody>
                  {courseDetails.map((item: CourseDetail, idx: number) => {
                    const contents = item.contents
                      ? JSON.parse(item.contents)
                      : [""];

                    return (
                      <React.Fragment key={`section-${item.section_id}`}>
                        <tr className="bg-gray-100 border">
                          <td className="p-2">
                            セクション{item.section_number}: {item.section_name}
                          </td>
                        </tr>
                        {contents.map((content: Content) => {
                          const contentRowStyle =
                            contentId === String(content.content_id)
                              ? "border bg-gray-300"
                              : "border";
                          return (
                            <tr
                              key={`content-${content.content_id}`}
                              className={contentRowStyle}
                            >
                              <td className="py-2 ps-2">
                                <input
                                  type="checkbox"
                                  className="me-2"
                                  checked={completedContentIdRow.includes(
                                    content.content_id!
                                  )}
                                  readOnly
                                />
                                <Link
                                  href={`/myLearning/${userId}/${courseId}/${content.content_id}`}
                                >
                                  {content.content_name
                                    ? content.content_name
                                    : ""}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

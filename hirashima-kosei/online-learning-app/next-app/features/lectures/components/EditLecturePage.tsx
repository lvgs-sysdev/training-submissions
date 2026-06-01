"use client";

import CreateCourse from "@/features/lectures/components/CreateCourse";
import CreateSection from "@/features/lectures/components/CreateSection";
import useLectures from "@/features/lectures/hooks/useLectures";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import CreateContent from "@/features/lectures/components/CreateContent";
import { LectureDetail, LectureDetails, LectureItem } from "@/types";
import { axiosClient } from "@/lib/api/api-client";

export default function EditLecturePage({
  existingLectureData = undefined,
}: {
  existingLectureData?:
    | {
        lectureItem: LectureItem;
        lectureDetails: LectureDetails;
      }
    | undefined;
}) {
  const {
    layer,
    setLayer,
    lectureItem,
    setLectureItem,
    lectureDetails,
    setLectureDetails,
    files,
    setFiles,
    currentSectionIndex,
    setCurrentSectionIndex,
  } = useLectures(existingLectureData);

  const { userState } = useAuth();

  const router = useRouter();

  const handleOnClickRow: (sectionIndex: number) => void = (
    sectionIndex: number
  ) => {
    setLayer(layer + 1);
    setCurrentSectionIndex(sectionIndex);
  };

  const handleOnClickPlusContent: () => void = () => {
    const newLectureDetails = lectureDetails.map(
      (detail: LectureDetail, idx: number) => {
        if (idx === currentSectionIndex) {
          return {
            ...detail,
            contents: detail.contents?.concat({
              content_name: "",
              body: "",
              content_id: -1,
              content_type: "text",
            }),
          };
        }
        return detail;
      }
    );
    setLectureDetails(newLectureDetails);
  };

  const handleOnClickPlusSection: () => void = () => {
    const newLectureDetails = lectureDetails?.concat({
      section_name: "新規セクション",
      section_id: -1,
      contents: [
        { content_name: "", body: "", content_id: -1, content_type: "text" },
      ],
    });
    setLectureDetails(newLectureDetails);
  };

  const handleOnClickDeleteSection: (sectionIndex: number) => void = (
    sectionIndex: number
  ) => {
    const newLectureDetails = JSON.parse(JSON.stringify(lectureDetails));
    newLectureDetails.splice(sectionIndex, 1);
    setLectureDetails(newLectureDetails);
  };

  const handleOnClickDeleteContent: (contentIndex: number) => void = (
    contentIndex: number
  ) => {
    const newLectureDetails = JSON.parse(JSON.stringify(lectureDetails));
    newLectureDetails[currentSectionIndex].contents.splice(contentIndex, 1);
    setLectureDetails(newLectureDetails);
  };

  const completeEditLecture = async () => {
    try {
      await axiosClient.put("/lecture/course", {
        lectureItem,
        lectureDetails,
        userId: userState?.userId,
      });
      router.push(`/myLecture/${userState?.userId}`);
    } catch (err: any) {
      alert(err);
    }
  };

  if (layer === 0) {
    return (
      <section className="container mx-auto mt-10 p-4">
        <CreateCourse
          lectureItem={lectureItem}
          setLectureItem={setLectureItem}
          files={files}
          setFiles={setFiles}
        />
        <div className="flex justify-end gap-3 mt-10">
          <Button
            className="bg-transparent text-black border-1 hover:bg-gray-100"
            onClick={() => {
              router.push(`/myLecture/${userState?.userId}`);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={() => setLayer(layer + 1)}>次に進む</Button>
        </div>
      </section>
    );
  } else if (layer === 1) {
    return (
      <section className="container mx-auto mt-10 p-4">
        <CreateSection
          lectureDetails={lectureDetails}
          handleOnClickRow={handleOnClickRow}
          handleOnClickPlusSection={handleOnClickPlusSection}
          handleOnClickDeleteSection={handleOnClickDeleteSection}
        />
        <div className="flex justify-end gap-3 mt-10">
          <Button
            className="bg-transparent text-black border-1 hover:bg-gray-100"
            onClick={() => {
              router.push(`/myLecture/${userState?.userId}`);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={() => setLayer(layer - 1)}>戻る</Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => completeEditLecture()}
          >
            作成完了
          </Button>
        </div>
      </section>
    );
  } else {
    return (
      <section className="container mx-auto mt-10 p-4">
        <CreateContent
          lectureDetails={lectureDetails}
          setLectureDetails={setLectureDetails}
          currentSectionIndex={currentSectionIndex}
          handleOnClickPlusContent={handleOnClickPlusContent}
          handleOnClickDeleteContent={handleOnClickDeleteContent}
        />
        <div className="flex justify-end gap-3 mt-10">
          <Button
            className="bg-transparent text-black border-1 hover:bg-gray-100"
            onClick={() => {
              router.push(`/myLecture/${userState?.userId}`);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={() => setLayer(layer - 1)}>戻る</Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => completeEditLecture()}
          >
            作成完了
          </Button>
        </div>
      </section>
    );
  }
}

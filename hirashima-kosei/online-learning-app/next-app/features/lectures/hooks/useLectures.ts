import { LectureItem, LectureDetails } from "@/types";
import { useState } from "react";

export default function useLectures(existingLectureData?: {
  lectureItem: LectureItem;
  lectureDetails: LectureDetails;
}) {
  const [layer, setLayer] = useState<number>(0);
  const [lectureItem, setLectureItem] = useState<LectureItem>(
    existingLectureData
      ? existingLectureData.lectureItem
      : {
          course_name: "",
          course_description: "",
          thumbnail: null,
          published: 0,
        }
  );
  const [lectureDetails, setLectureDetails] = useState<LectureDetails>(
    existingLectureData
      ? existingLectureData.lectureDetails
      : [
          {
            section_name: "新規セクション",
            contents: [{ content_name: "", body: "", content_type: "text" }],
          },
        ]
  );
  const [files, setFiles] = useState<File[] | undefined>();
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const handleOnClick = (selectedLayer: number) => {
    setLayer(selectedLayer);
  };

  return {
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
    handleOnClick,
  };
}

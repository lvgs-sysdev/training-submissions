import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { LectureItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ShowBlobData from "@/features/courses/components/showBlobData";

export default function ThumbnailDropzone({
  lectureItem,
  setLectureItem,
  files,
  setFiles,
}: {
  lectureItem: LectureItem;
  setLectureItem(sectionItem: LectureItem): void;
  files: File[] | undefined;
  setFiles(files: File[] | undefined): void;
}) {
  const handleDrop = (files: File[]) => {
    setFiles(files);

    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setLectureItem({
            ...lectureItem,
            thumbnail: e.target?.result,
          });
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      setLectureItem({ ...lectureItem, thumbnail: null });
    }
  };

  return (
    <>
      {/* サムネイルが設定されていない場合のみDropzoneを表示 */}
      {!lectureItem?.thumbnail && (
        <Dropzone
          accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
          onDrop={handleDrop}
          onError={console.error}
        >
          <DropzoneEmptyState />
          <DropzoneContent>{/* 空の状態では何も表示しない */}</DropzoneContent>
        </Dropzone>
      )}

      {/* サムネイルが設定されている場合は画像とゴミ箱ボタンを表示 */}
      {lectureItem?.thumbnail && (
        <div className="relative">
          <div className="h-102 w-full">
            <ShowBlobData
              bufferData={lectureItem?.thumbnail}
              className="absolute top-0 left-0 h-full w-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
            onClick={() => {
              setFiles(undefined);
              setLectureItem({ ...lectureItem, thumbnail: null });
            }}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </>
  );
}

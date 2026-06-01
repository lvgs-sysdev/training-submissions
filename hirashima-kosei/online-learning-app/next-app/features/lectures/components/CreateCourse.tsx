import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LectureItem } from "@/types";
import ThumbnailDropzone from "./ThumbnailDropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosClient } from "@/lib/api/api-client";
import { useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function CreateCourse({
  lectureItem,
  setLectureItem,
  files,
  setFiles,
}: {
  lectureItem: LectureItem;
  setLectureItem(lectureItem: LectureItem): void;
  files: File[] | undefined;
  setFiles(files: File[] | undefined): void;
}) {
  const [inputCourseName, setInputCourseName] = useState<string>("");
  const [isDifferentNameError, setIsDifferentNameError] =
    useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const router = useRouter();
  const { userState } = useAuth();

  async function commitDeleteCourse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDeleting(true);

    try {
      if (inputCourseName !== lectureItem.course_name) {
        setIsDifferentNameError(true);
        return;
      }
      await axiosClient.delete("/lecture/course", {
        data: { courseId: lectureItem.course_id },
      });
      setIsDeleting(false);
      router.push(`/myLecture/${userState?.userId}`);
    } catch (err: any) {
      alert(err.response.data.error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <FieldSet>
        <FieldLegend>
          コースを作成しましょう！
          {lectureItem?.course_id && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-transparent text-red-400 border-red-400 border-1 hover:bg-red-50">
                  コースを削除する
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={(event) => commitDeleteCourse(event)}>
                  <DialogHeader>
                    <DialogTitle>削除してよろしいでしょうか。</DialogTitle>
                    <DialogDescription>
                      この操作は取り消しできません。
                      操作を削除してよければ以下のフィールドにコース名（「
                      {lectureItem.course_name}
                      」）を入力し、確定ボタンを押下してください。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 mt-2 mb-2">
                    <Label htmlFor="course-name">削除するコース名</Label>
                    <Input
                      id="course-name"
                      name="course_name"
                      onChange={(e) => {
                        setInputCourseName(e.target.value);
                        setIsDifferentNameError(false);
                      }}
                    />
                    {!!isDifferentNameError && (
                      <>
                        <Alert variant="destructive" className="mb-5">
                          <AlertCircleIcon />
                          <AlertTitle>エラー</AlertTitle>
                          <AlertDescription>
                            <p>コース名が異なります。再度入力してください。</p>
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">キャンセル</Button>
                    </DialogClose>
                    <Button type="submit">
                      {isDeleting ? <Spinner /> : "確定"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </FieldLegend>
        <FieldDescription>以下の項目を入力してください。</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">コースのタイトル</FieldLabel>
            <Input
              id="title"
              autoComplete="on"
              placeholder=""
              value={lectureItem?.course_name}
              onChange={(e) => {
                setLectureItem({
                  ...lectureItem,
                  course_name: e.target.value,
                });
              }}
            />
            <FieldDescription>
              コース名はいつでも変更できます。
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">コースの説明文</FieldLabel>
            <Textarea
              id="description"
              autoComplete="on"
              placeholder=""
              rows={4}
              value={lectureItem?.course_description}
              onChange={(e) => {
                setLectureItem({
                  ...lectureItem,
                  course_description: e.target.value,
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="thumbnail">コースのサムネイル</FieldLabel>
            <ThumbnailDropzone
              lectureItem={lectureItem}
              setLectureItem={setLectureItem}
              files={files}
              setFiles={setFiles}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </>
  );
}

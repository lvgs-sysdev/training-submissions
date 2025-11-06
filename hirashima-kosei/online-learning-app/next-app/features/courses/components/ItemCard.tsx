import { Card, CardContent } from "@/components/ui/card";
import { CourseItem } from "@/types";
import Link from "next/link";
import HoverItemCard from "./HoverCard";
import ShowBlobData from "./showBlobData";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/lib/api/api-client";

export default function ItemCard({
  courseItem,
  isLecture = false,
}: {
  courseItem: CourseItem;
  isLecture?: boolean;
}) {
  const commitChangePublished = async () => {
    try {
      await axiosClient.post("/lecture/course/publish", {
        published: !!courseItem.published ? 0 : 1,
        courseId: courseItem.id,
      });
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  if (!isLecture) {
    return (
      <HoverItemCard courseItem={courseItem}>
        <Link href={`/course/${courseItem.id}`}>
          <Card className="pt-0 rounded-none hover:bg-gray-100">
            <ShowBlobData
              bufferData={courseItem.thumbnail}
              className="w-full aspect-[5/4] object-cover"
            />
            <CardContent className="ps-2">
              <p className="line-clamp-2">{courseItem.course_name}</p>
              <p className="truncate">{courseItem.course_description}</p>
              <p className="truncate">{courseItem.user_name}</p>
            </CardContent>
          </Card>
        </Link>
      </HoverItemCard>
    );
  }

  return (
    <>
      <Card className="pt-0 rounded-none hover:bg-gray-100">
        <Link href={`/lecture/${courseItem.id}`}>
          <ShowBlobData
            bufferData={courseItem.thumbnail}
            className="w-full aspect-[3/2] object-cover"
          />
          <CardContent className="ps-2">
            <p className="line-clamp-2">{courseItem.course_name}</p>
            <p className="truncate">{courseItem.course_description}</p>
            <p className="truncate">{courseItem.user_name}</p>
          </CardContent>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-transparent border border-black text-black hover:bg-gray-300">
              {!courseItem.published ? "非公開" : "公開中"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                コースを{!courseItem.published ? "公開" : "非公開に"}します。
              </DialogTitle>
              <DialogDescription>
                コースを{!courseItem.published ? "公開" : "非公開に"}
                してよければ確定ボタンを押下してください。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogClose>
              <Button onClick={() => commitChangePublished()}>確定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}

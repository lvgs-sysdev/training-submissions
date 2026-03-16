import MyLectureList from "./MyLectureList";
import { axiosServerClient } from "@/lib/api/api-client";
import Link from "next/link";

export default async function MyLecturePage({ userId }: { userId: string }) {
  try {
    const response = await axiosServerClient.get("/lecture/course", {
      params: { userId },
    });

    const courses = response.data.courses;

    return (
      <>
        <section>
          <div className="bg-black text-white pb-0">
            <div className="container mx-auto p-4">
              <h1 className="text-4xl">マイレクチャー</h1>
            </div>
          </div>
        </section>
        <section className="p-4 w-full">
          <div className="container mx-auto">
            <div className="divide-y space-y-5">
              <div className="p-10 xl:p-9">
                <div className="md:flex justify-between mb-5">
                  <p className="text-xl mb-2">コース一覧</p>
                  <Link
                    href={"/lecture"}
                    className="text-xl text-blue-500 hover:underline"
                  >
                    コースの新規作成はこちら
                  </Link>
                </div>
                <MyLectureList courses={courses} />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (err: any) {
    throw err.msg;
  }
}

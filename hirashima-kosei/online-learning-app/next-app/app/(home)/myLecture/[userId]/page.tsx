import MyLecturePage from "@/features/courses/components/MyLecturePage";

export default async function MyLecture({
  params,
}: PageProps<'/myLecture/[userId]'>) {
  const { userId } = await params;

  return (
    <>
      <MyLecturePage userId={userId} />
    </>
  );
}

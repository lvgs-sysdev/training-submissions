import { PageHeading } from "@/components/PageHeading";
import { PostForm } from "@/features/post/components/PostForm";
import { createPost } from "@/features/post/actions";
import { getVerifiedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PostPage() {
  const user = await getVerifiedUser()
  if (!user) redirect('/')

  return (
    <>
    <PageHeading heading={'New Log'} />
    <PostForm action={createPost} />
    </>
  )
}

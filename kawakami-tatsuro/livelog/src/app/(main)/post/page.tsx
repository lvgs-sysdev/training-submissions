import { PageHeading } from "@/components/PageHeading";
import { PostForm } from "@/features/posts/components/PostForm";
import { createPost } from "@/features/posts/service";

export default function PostPage() {
  return (
    <>
    <PageHeading heading={'New Log'} />
    <PostForm action={createPost} />
    </>
  )
}

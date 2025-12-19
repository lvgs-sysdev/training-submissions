import { PageHeading } from "@/components/PageHeading";
import { PostForm } from "@/features/posts/components/PostForm";
import { createPost } from "@/features/posts/actions";

export default function PostPage() {
  return (
    <>
    <PageHeading heading={'New Log'} />
    <PostForm action={createPost} />
    </>
  )
}

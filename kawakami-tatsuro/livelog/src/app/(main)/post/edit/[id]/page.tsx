import { fetchPostById, updatePost } from "@/features/posts/service";
import { PageParams } from "../../../../../../types";
import { PageHeading } from "@/components/PageHeading";
import { PostForm } from "@/features/posts/components/PostForm";
import { redirect } from "next/navigation";

export default async function PostEditPage({ params }: PageParams<{id: string}>) {
  const { id } = await params
  const post = await fetchPostById(id)
  if (!post) {
    redirect('/')
  }
  
  const initialData = {
    show_date: post.show_date,
    artist_id: post.artist_id,
    artist_name: post.artist_name,
    track_id: post.track_id,
    track_title: post.track_title,
    content: post.content,
  }

  const updatePostWithId = updatePost.bind(null, Number(id))

  return (
    <>
    <PageHeading heading={'Edit Log'} />
    <PostForm action={updatePostWithId} initialData={initialData} />
    </>
  )
}

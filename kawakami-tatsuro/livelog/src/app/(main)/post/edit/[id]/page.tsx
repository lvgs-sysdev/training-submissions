import { fetchPostById } from "@/features/post/service";
import { updatePost } from "@/features/post/actions";
import { PageParams } from "../../../../../../types";
import { PageHeading } from "@/components/PageHeading";
import { PostForm } from "@/features/post/components/PostForm";
import { redirect } from "next/navigation";
import { getVerifiedUser } from "@/lib/auth";

export default async function PostEditPage({ params }: PageParams<{id: string}>) {
  const user = await getVerifiedUser()
  const { id } = await params // ポストのIDの取得
  const post = await fetchPostById(user?.id, id)

  if (!post) redirect('/') // ポストが存在しなければリダイレクト
  if (post.user_id !== user?.id) redirect('/') // ポストの投稿者とログインしているユーザーのIDが一致しなければリダイレクト
  
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

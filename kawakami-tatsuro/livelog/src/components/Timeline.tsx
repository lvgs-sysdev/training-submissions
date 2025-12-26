import { Post } from "@/features/post/types"
import { PostItem } from "./PostItem"

interface Props {
  posts: Post[]
  currentUserId?: number
}

export const Timeline = ({ posts, currentUserId }: Props) => {
  return (
    <>
      {posts.length > 0
      ? <div className="divide-y w-full">
          {posts.map((post) => {
      
          return (
            <PostItem key={post.id} post={post} currentUserId={currentUserId} />
          )
          })}
          </div>
      : <p className="text-center">There are no posts yet.</p>}
    </>
  )
}

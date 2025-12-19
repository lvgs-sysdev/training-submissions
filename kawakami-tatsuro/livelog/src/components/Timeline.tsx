import { Post } from "@/features/posts/types"
import { PostItem } from "./PostItem"

interface Props {
  posts: Post[]
  currentUserId: number
}

export const Timeline = ({ posts, currentUserId }: Props) => {
  return (
    <div className="divide-y w-full">
        {posts.map((post) => {
          
        return(
          <PostItem key={post.id} post={post} currentUserId={currentUserId} />
          )
        })}
        </div>
  )
}

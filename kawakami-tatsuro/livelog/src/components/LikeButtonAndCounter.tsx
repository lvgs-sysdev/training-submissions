'use client'
import { useState } from "react"
import { createLike, deleteLike } from "@/features/posts/actions"
import { Button } from "./ui/button"
import { ThumbsUp } from "lucide-react"

interface Props {
  initialCount: number;
  initialIsLikedByMe: boolean;
  currentUserId: number;
  postId: number;
}

export const LikeButtonAndCounter = ({ initialCount, initialIsLikedByMe, currentUserId, postId }: Props) => {
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLikedByMe, setIsLikedByMe] = useState(initialIsLikedByMe)

  const handleClick = async () => {
    if (isLikedByMe) {
      setLikeCount((prev) => prev - 1)
      setIsLikedByMe((prev) => !prev)
      await deleteLike(currentUserId, postId)
    } else {
      setLikeCount((prev) => prev + 1)
      setIsLikedByMe((prev) => !prev)
      await createLike(currentUserId, postId)
    }
  }
  return (
    <div>
      <Button onClick={handleClick} variant="ghost" size="icon" className="cursor-pointer">
        <ThumbsUp className={isLikedByMe ? 'fill-neutral-500' : ''} />
      </Button>
      <span className="text-sm">{likeCount}</span>
    </div>
  )
}

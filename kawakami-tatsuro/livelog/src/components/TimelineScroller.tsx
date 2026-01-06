'use client'

import { Post } from "@/features/post/types"
import { useEffect, useRef, useState } from "react"
import { Timeline } from "./Timeline"
import { Loader2 } from "lucide-react"

interface Props {
  initialPosts: Post[];
  currentUserId: number | undefined;
  getMorePosts: (cursorId: number, limit: number) => Promise<Post[]>;
  limit: number;
}

export const TimelineScroller = ({ initialPosts, currentUserId, getMorePosts, limit }: Props) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerRef.current) return
    const observer = new IntersectionObserver(async (entries) => {
      const firstEntry = entries[0]

      if (firstEntry.isIntersecting && hasMore && !isLoading) {
        try {
          setIsLoading(true)

          const cursorId = posts[posts.length -1].id
          const additionalPosts = await getMorePosts(cursorId, limit + 1,)
          if (additionalPosts.length < limit + 1) setHasMore(false)
          
          const displayedPosts = [...posts, ...additionalPosts.slice(0, limit)]
          setPosts(displayedPosts)
        } catch {
          alert('投稿の取得に失敗しました。ページを更新してください。')
        } finally {
          setIsLoading(false)
        }
      }
    }, {
      rootMargin: '100px'
    })

    if (triggerRef.current) observer.observe(triggerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [getMorePosts, hasMore, posts, isLoading])

  return (
    <>
    <Timeline posts={posts} currentUserId={currentUserId} />
    {isLoading && <Loader2 className="animate-spin text-muted-foreground mx-auto" />}
    {posts.length !== 0 && hasMore && <div id="trigger" ref={triggerRef}></div>}
    </>
  )
}

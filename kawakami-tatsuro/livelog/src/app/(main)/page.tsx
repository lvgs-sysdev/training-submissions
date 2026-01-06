import { PageHeading } from "@/components/PageHeading";
import { TimelineScroller } from "@/components/TimelineScroller";
import { getPosts } from "@/features/post/actions";
import { Post } from "@/features/post/types";
import { getVerifiedUser } from "@/lib/auth";

export const revalidate = 60 // 1分間ごとに更新されるISRに仮で設定

const LIMIT_NUM_OF_POSTS = 10

export default async function Home () {
  const user = await getVerifiedUser()
  const posts: Post[] = await getPosts(user?.id, undefined, LIMIT_NUM_OF_POSTS)
  const boundAction = getPosts.bind(null, user?.id)
  return (
    <>
    <PageHeading heading="Timeline" />
    <TimelineScroller initialPosts={posts} currentUserId={user?.id} getMorePosts={boundAction} limit={LIMIT_NUM_OF_POSTS} />
    </>
    )
}

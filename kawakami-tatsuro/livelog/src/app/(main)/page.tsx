import { PageHeading } from "@/components/PageHeading";
import { Timeline } from "@/components/Timeline";
import { fetchPosts } from "@/features/posts/service";
import { Post } from "@/features/posts/types";

const CURRENT_USER_ID = 1

export const revalidate = 60;

export default async function Home () {
  const posts: Post[] = await fetchPosts(CURRENT_USER_ID)
  return (
    <>
    <PageHeading heading="Timeline" />
    <Timeline posts={posts} currentUserId={CURRENT_USER_ID} />
    </>
    )
}

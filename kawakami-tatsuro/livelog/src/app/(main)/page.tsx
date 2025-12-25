import { PageHeading } from "@/components/PageHeading";
import { Timeline } from "@/components/Timeline";
import { fetchPosts } from "@/features/post/service";
import { Post } from "@/features/post/types";
import { getVerifiedUser } from "@/lib/auth";

export const revalidate = 60;

export default async function Home () {
  const user = await getVerifiedUser()
  const posts: Post[] = await fetchPosts(user?.id)
  return (
    <>
    <PageHeading heading="Timeline" />
    <Timeline posts={posts} currentUserId={user?.id} />
    </>
    )
}

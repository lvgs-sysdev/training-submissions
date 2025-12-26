import { PageHeading } from "@/components/PageHeading";
import { Timeline } from "@/components/Timeline";
import { getArtistsFromInput } from "@/features/post/search/action";
import { SearchInput } from "@/features/post/search/components/SearchInput";
import { fetchPostsByArtistName } from "@/features/post/service";
import { Post } from "@/features/post/types";
import { getVerifiedUser } from "@/lib/auth";

interface Props {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

export default async function SearchPage ({ searchParams }: Props) {
  const user = await getVerifiedUser()
  const params = await searchParams // URLのパラメータから取得
  const artistName = typeof params.artist === 'string' ? params.artist : undefined
  let posts: Post[] = []

  if (artistName) {
    posts = await fetchPostsByArtistName(user?.id, artistName)
  }
  return (
    <>
      <PageHeading heading="Search" />
      <SearchInput getArtistsFromInput={getArtistsFromInput} defaultValue={artistName} />
      {artistName && <Timeline posts={posts} currentUserId={user?.id} />}
    </>
  )
}

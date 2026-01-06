import { PageHeading } from "@/components/PageHeading";
import { TimelineScroller } from "@/components/TimelineScroller";
import { getPostsByArtistName } from "@/features/post/actions";
import { getArtistsFromInput } from "@/features/post/search/action";
import { SearchInput } from "@/features/post/search/components/SearchInput";
import { getVerifiedUser } from "@/lib/auth";

const LIMIT_NUM_OF_POSTS = 10

interface Props {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

export default async function SearchPage ({ searchParams }: Props) {
  const user = await getVerifiedUser()
  const params = await searchParams // URLのパラメータから取得
  const artistName = typeof params.artist === 'string' ? params.artist : undefined

  if (!artistName) {
    return (
      <>
      <PageHeading heading="Search" />
      <SearchInput getArtistsFromInput={getArtistsFromInput} defaultValue='' />
      </>
    )
  }

  const posts = await getPostsByArtistName(user?.id, artistName, undefined, LIMIT_NUM_OF_POSTS)
  const boundAction = getPostsByArtistName.bind(null, user?.id, artistName)

  return (
    <>
      <PageHeading heading="Search" />
      <SearchInput getArtistsFromInput={getArtistsFromInput} defaultValue={artistName} />
      {artistName && <TimelineScroller initialPosts={posts} currentUserId={user?.id} getMorePosts={boundAction} limit={LIMIT_NUM_OF_POSTS} />}
    </>
  )
}

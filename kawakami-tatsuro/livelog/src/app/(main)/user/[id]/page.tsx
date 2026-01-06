import { PageHeading } from '@/components/PageHeading'
import { fetchPostsByUserId } from '@/features/post/service'
import { PageParams, SpotifyArtist } from '../../../../../types'
import { Timeline } from '@/components/Timeline'
import { User } from '@/features/user/types'
import { fetchUserById } from '@/features/user/service'
import { fetchArtistsByIds } from '@/lib/spotify'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/features/user/components/UserProfile'
import { getVerifiedUser } from '@/lib/auth'
import { getPostsByUserId } from '@/features/post/actions'
import { TimelineScroller } from '@/components/TimelineScroller'

const LIMIT_NUM_OF_POSTS = 10

export default async function UserPage({params}: PageParams<{id: string}>) {
  const user = await getVerifiedUser()
  const { id } = await params // URLのパラメータからユーザーIDの取得
  const targetUser: User | undefined = await fetchUserById(id)
  if (targetUser === undefined) {
    redirect('/')
  }

  const posts = await getPostsByUserId(user?.id, id, undefined, LIMIT_NUM_OF_POSTS)

  const boundAction = getPostsByUserId.bind(null, user?.id, id)

  const uniqueArtistIds = Array.from(new Set(posts.map(post => post.artist_id))) // 当該ユーザーの全投稿に紐づいたアーティストのIDから一意のアーティストIDの配列を作成
  const artists: SpotifyArtist[] = await fetchArtistsByIds(uniqueArtistIds)

  return (
    <>
    <PageHeading heading={'Profile'} />
    <UserProfile user={targetUser} artists={artists} />
    <TimelineScroller initialPosts={posts} currentUserId={user?.id} getMorePosts={boundAction} limit={LIMIT_NUM_OF_POSTS} />
    </>
  )
}

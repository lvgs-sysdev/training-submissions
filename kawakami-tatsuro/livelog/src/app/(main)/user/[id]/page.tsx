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

export default async function UserPage({params}: PageParams<{id: string}>) {
  const user = await getVerifiedUser()
  const { id } = await params
  const targetUser: User | undefined = await fetchUserById(id)
  if (targetUser === undefined) {
    redirect('/')
  }

  const posts = await fetchPostsByUserId(user?.id, id)

  const uniqueArtistIds = Array.from(new Set(posts.map(post => post.artist_id)))
  const artists: SpotifyArtist[] = await fetchArtistsByIds(uniqueArtistIds)

  return (
    <>
      <PageHeading heading={'Profile'} />
      <UserProfile user={targetUser} artists={artists} />
      <Timeline posts={posts} currentUserId={user?.id} />
    </>
  )
}

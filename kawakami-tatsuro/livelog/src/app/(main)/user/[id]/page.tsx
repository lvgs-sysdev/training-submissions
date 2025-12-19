import { PageHeading } from '@/components/PageHeading'
import { fetchPostsByUserId } from '@/features/posts/service'
import { PageParams, SpotifyArtist } from '../../../../../types'
import { Timeline } from '@/components/Timeline'
import { User } from '@/features/users/types'
import { fetchUserById } from '@/features/users/service'
import { fetchArtistsByIds } from '@/lib/spotify'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/features/users/components/UserProfile'


const CURRENT_USER_ID = 1

export default async function UserPage({params}: PageParams<{id: string}>) {
  const { id } = await params
  const user: User | undefined = await fetchUserById(id)
  if (user === undefined) {
    redirect('/')
  }

  const posts = await fetchPostsByUserId(CURRENT_USER_ID, id)

  const uniqueArtistIds = Array.from(new Set(posts.map(post => post.artist_id)))
  const artists: SpotifyArtist[] = await fetchArtistsByIds(uniqueArtistIds)

  return (
    <>
      <PageHeading heading={'Profile'} />
      <UserProfile user={user} artists={artists} />
      <Timeline posts={posts} currentUserId={CURRENT_USER_ID} />
    </>
  )
}

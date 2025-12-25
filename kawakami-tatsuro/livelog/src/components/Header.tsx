import Link from 'next/link'
import { NavForUser } from './NavForUser'
import { NavForGuest } from './NavForGuest'
import { getVerifiedUser } from '@/lib/auth'
import { zalandSansExpanded } from '@/lib/fonts'

export const Header = async () => {
  const user = await getVerifiedUser()

  return (
    <header className="p-4 flex justify-between">
      <Link className="block" href={'/'}>
        <p className={`${zalandSansExpanded.variable} font-zaland-sans-expanded text-4xl font-bold`}>Livelog</p>
      </Link>
      {user ? <NavForUser id={user.id} /> : <NavForGuest />}
    </header>
  )
}

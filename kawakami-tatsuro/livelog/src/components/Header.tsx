import Link from 'next/link'
import { NavForUser } from './NavForUser'
import { NavForGuest } from './NavForGuest'
import { getVerifiedUser } from '@/lib/auth'
import { zalandSansExpanded } from '@/lib/fonts'
import { TokenWatcher } from './TokenWatcher'

export const Header = async () => {
  // ユーザーがログインしているかどうかによって表示を切り替える
  const user = await getVerifiedUser()

  return (
    <>
      <TokenWatcher isUserLoggedIn={!!user} />
      <header className="p-4 flex justify-between">
        <Link className="block" href={'/'}>
          <p className={`${zalandSansExpanded.variable} font-zaland-sans-expanded text-4xl font-bold`}>Livelog</p>
        </Link>
        {user ? <NavForUser id={user.id} /> : <NavForGuest />}
      </header>
    </>
  )
}

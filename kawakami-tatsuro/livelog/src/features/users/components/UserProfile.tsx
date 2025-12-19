import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDateForInput } from '@/lib/utils'
import { ProfileImage } from '@/components/ProfileImage'
import { User } from '../types';
import { SpotifyArtist } from '../../../../types';
import Image from 'next/image'
import { ArtistsList } from '@/components/ArtistsList';

interface Props {
  user: User;
  artists: SpotifyArtist[];
}

export const UserProfile = ({ user, artists }: Props) => {
  return (
    <Card className="shadow-none border-none rounded-none w-full flex flex-col gap-9">
      <CardHeader className="flex flex-row gap-9">
        <ProfileImage
          picPath={user?.pic_path}
          userName={user?.user_name}
          className={'size-16'}
        />
        <div className="flex flex-col gap-2">
          <p className="truncate font-bold text-2xl">TestUser</p>
          <p className="text-muted-foreground">{`Joined ${formatDateForInput(
            user?.created_at
          )}`}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <h3 className="text-xl font-bold self-start">{`${user?.user_name}'s Recent Live Shows`}</h3>
        <ArtistsList artists={artists} />
      </CardContent>
    </Card>
  )
}

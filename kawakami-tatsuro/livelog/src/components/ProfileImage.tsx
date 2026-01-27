import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

interface Props {
  picPath: string | undefined;
  userName: string | undefined;
  className?: string;
}

export const ProfileImage = ({ picPath, userName, className }: Props) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={picPath ? picPath : '/profile.png'} />
      <AvatarFallback>{userName?.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}

import { Post } from "@/features/posts/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDateForInput } from "@/lib/utils";
import { SpotifyPreview } from "@/components/SpotifyPreview";
import { PostOwnerActions } from "./PostOwnerActions";
import { deletePost } from "@/features/posts/actions";
import { LikeButtonAndCounter } from "./LikeButtonAndCounter";
import { ProfileImage } from "./ProfileImage";
import Link from "next/link";

interface Props {
  post: Post
  currentUserId: number
}

export const PostItem = ({ post, currentUserId }: Props) => {
  return (
    <div className="w-full" key={post.id}>
      <Card className="shadow-none border-none rounded-none w-full">
        <CardHeader className="flex flex-row gap-6 w-full">
          <Link href={`/user/${currentUserId}`}>
            <ProfileImage picPath={post.pic_path} userName={post.user_name} />
          </Link>
          <div className="flex justify-between flex-1 w-full min-w-0 gap-2">
            <Link className="block" href={`/user/${currentUserId}`}>
              <p className="truncate">{post.user_name}</p>
            </Link>
            <p className="shrink-0 whitespace-nowrap">
              {formatDateForInput(post.created_at)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <Badge className="text-base justify-start max-w-full shrink min-w-0">
              <span className="truncate">{post.artist_name}</span>
            </Badge>
            <Badge className="text-sm justify-start max-w-full shrink min-w-0">
              <span className="truncate">
                {formatDateForInput(post.show_date)}
              </span>
            </Badge>
          </div>
          <p className="wrap-anywhere">{post.content}</p>
          <SpotifyPreview trackId={post.track_id} />
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <LikeButtonAndCounter initialCount={post.like_count} initialIsLikedByMe={post.is_liked_by_me} currentUserId={currentUserId} postId={post.id} />
          {post.user_id === currentUserId
          && <PostOwnerActions postId={post.id} onDelete={deletePost} />}
        </CardFooter>
      </Card>
    </div>
  )
}

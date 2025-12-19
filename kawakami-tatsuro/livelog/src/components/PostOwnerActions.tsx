'use client'
import { Button } from "./ui/button"
import { Trash2, SquarePen } from "lucide-react"
import Link from "next/link"

interface Props {
  postId: number;
  onDelete: (postId: number) => Promise<void>;
}

export const PostOwnerActions = ({ postId, onDelete }: Props) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await onDelete(postId);
    }
  }

  return (
    <div>
      <Button onClick={handleDelete} variant="ghost" size="icon" className="cursor-pointer">
        <Trash2 className="text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
        <Link href={`/post/edit/${postId}`}>
          <SquarePen className="text-muted-foreground" />
        </Link>
      </Button>
    </div>
  )
}

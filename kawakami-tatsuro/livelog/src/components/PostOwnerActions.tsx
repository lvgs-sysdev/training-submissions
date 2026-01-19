'use client'
import { Button } from "./ui/button"
import { Trash2, SquarePen } from "lucide-react"
import Link from "next/link"
import { ApiResponse } from "../types";
import { useRouter } from "next/navigation";

interface Props {
  postId: number;
  onDelete: (postId: number) => Promise<ApiResponse<null>>;
}


export const PostOwnerActions = ({ postId, onDelete }: Props) => {
  const router = useRouter()
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const response = await onDelete(postId)
    if (response.success) return router.refresh()
    if (response.status === 401) return alert('Your session has timed out.\nPlease log in again.')
    if (response.status === 404) {
      alert('This post is not found.\nIt may have already been deleted. ')
      router.refresh()
      return
    }
    if (response.status === 500) return alert('Something went wrong. Please try again later.')
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

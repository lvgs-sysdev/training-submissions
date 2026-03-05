'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface Props {
  error: Error & { digest?: string },
  reset: () => void
}

export default function Error ({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="text-center p-8 gap-4">
      <h2 className="text-2xl">Something went wrong.</h2>
      <Button className="mt-6 cursor-pointer" onClick={() => reset()}>Try Again</Button>
    </div>
  )
}

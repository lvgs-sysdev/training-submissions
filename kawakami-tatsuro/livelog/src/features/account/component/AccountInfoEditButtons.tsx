import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
  onEditButtonClick: () => void;
}

export const AccountInfoEditButtons = ({ onEditButtonClick }: Props) => {


  return (
    <>
      <Button onClick={onEditButtonClick} className="max-w-16 w-16 ml-auto">Edit</Button>
    </>
  )
}

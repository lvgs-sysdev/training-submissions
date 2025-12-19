'use client'

import { AccountInfo } from "../types"
import { Card } from "@/components/ui/card"
import { AccountInfoEditButtons } from "./AccountInfoEditButtons"
import { useState } from "react"
import { AccountInfoDisplay } from "./AccountInfoDisplay"
import { AccountInfoEditForm } from "./AccountInfoEditForm"
import { ApiResponse } from "../../../../types"

interface Props {
  action: (formData: FormData) => Promise<ApiResponse<null>>
  account: AccountInfo;
}

export const AccountInfoCard = ({ action, account }: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const onEditStart = () => setIsEditing(true)
  const onEditCancel = () => setIsEditing(false)

  return (
    <Card className="shadow-none px-4 py-10 flex flex-col gap-10">
      {isEditing
      ? <AccountInfoEditForm action={action} account={account} onCancelButtonClick={onEditCancel} onEditSuccess={() => setIsEditing(false)} />
      : <AccountInfoDisplay account={account} />}
    {!isEditing && <AccountInfoEditButtons onEditButtonClick={onEditStart} />}
    </Card>
  )
}

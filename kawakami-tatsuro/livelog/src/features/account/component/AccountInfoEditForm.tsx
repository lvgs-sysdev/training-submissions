'use client'

import { AccountInfo } from "../types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "../../../../types";
import { useState } from "react";

const MAX_LENGTH_OF_USER_NAME = 30

interface Props {
  action: (formData: FormData) => Promise<ApiResponse<null>>
  account: AccountInfo;
  onCancelButtonClick: () => void;
  onEditSuccess: () => void;
}


export const AccountInfoEditForm = ({ action, account, onCancelButtonClick, onEditSuccess }: Props) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [userName, setUserName] = useState<string>(account.user_name)
  const [email, setEmail] = useState<string>(account.email)
  const isEdited = userName !== account.user_name || email !== account.email

  const handleSubmit = async (formData: FormData) => {
    setFieldErrors({})

    const response: ApiResponse<null> = await action(formData)

    if (response.status === 401) alert('Your session has timed out.\nPlease log in again.')
    if (response.status === 409) setFieldErrors({email: 'This email address is already in use'})
    if (response.status === 500) alert('Something went wrong. Please try again later.')

    if (response.success) {
      alert('Account info is updated.')
      onEditSuccess()
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-10">
      <div className="flex flex-row gap-2">
        <Label htmlFor="userName" className="minw-0 text-base wrap-anywhere h-9">
          User Name: 
        </Label>
        <div className="flex flex-col gap-2">
          <Input type="text" id="userName" name="userName" defaultValue={userName} onChange={(e) => setUserName(e.target.value)} maxLength={MAX_LENGTH_OF_USER_NAME} className="w-auto" required />
          <p className="text-sm text-muted-foreground">Max 30 characters</p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Label htmlFor="email" className="min-w-0 text-base wrap-anywhere h-9">
          Email: 
        </Label>
        <div className="flex flex-col gap-2">
          <Input type="email" id="email" name="email" placeholder=" " defaultValue={email} onChange={(e) => setEmail(e.target.value)} className="w-auto peer" required />
          <p role="alert" className="hidden text-destructive text-sm peer-placeholder-shown:hidden peer-invalid:block">Please enter a valid email address.</p>
          {fieldErrors.email && <p role="alert" className="text-destructive text-sm">{fieldErrors.email}</p>}
        </div>
      </div>
      <div className="flex self-end gap-6">
        <Button onClick={onCancelButtonClick} variant="outline" className="max-w-20 w-20 cursor-pointer">Cancel</Button>
        <Button type="submit" className="max-w-20 w-20 cursor-pointer" disabled={!isEdited}>Save</Button>
      </div>
    </form>
  )
}

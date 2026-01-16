'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponse } from "../../../../../types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_LENGTH_OF_USER_NAME = 30
const MIN_LENGTH_OF_PASSWORD = 8

interface Props {
  registerAccount: (formData: FormData) => Promise<ApiResponse<{userId: number}>>
}

export const AccountRegisterForm = ({ registerAccount }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const response = await registerAccount(formData)

    if (response.status === 409) {
      setFieldErrors({'email': 'This email address is already in use.'})
    } else if (response.status === 500) {
      alert('Something went wrong. Please try again later.')
    } else if (response.code === 'IMG_UPLOAD_FAILED') {
      alert('Account created. Please retry uploading your image later.')
    } else {
      alert('Account created successfully.')
      router.push('/')
    }
    
    setIsSubmitting(false)

  } 
  return (
    <Card className="shadow-none px-4 py-9">
      <p>Please fill out the form below.</p>
      <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Field>
          <Label htmlFor="userName">User Name</Label>
          <Input
            type="text"
            id="userName"
            name="userName"
            maxLength={MAX_LENGTH_OF_USER_NAME}
            required
          />
          <p className="text-sm text-muted-foreground">Max 30 characters</p>
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" placeholder=" " className="peer" required />
          <p className="hidden text-destructive text-sm peer-placeholder-shown:hidden peer-[:not(:placeholder-shown):invalid]:block">
            Please enter a vailid email address.
          </p>
          {fieldErrors.email && <p role="alert" className="text-destructive text-sm">{fieldErrors.email}</p>}
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            minLength={MIN_LENGTH_OF_PASSWORD}
            required
          />
          <p className="text-sm text-muted-foreground">Minimum 8 characters</p>
        </Field>
        <Field>
          <Label htmlFor="picture" className="after:content-['optional'] after:text-muted-foreground">Profile Picture</Label>
          <Input
            type="file"
            id="picture"
            name="picture"
            accept="image/png, image/jpeg, image/jpg"
          />
        </Field>
        {isSubmitting
        ? <Button className="mt-4" disabled>...</Button>
        : <Button type="submit" className="mt-4">Register</Button>}
      </form>
    </Card>
  )
}

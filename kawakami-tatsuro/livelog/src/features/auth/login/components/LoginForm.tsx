'use client'

import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ReactEventHandler, useState } from 'react'
import { ApiResponse } from '../../../../types'
import { useRouter } from 'next/navigation'

interface Props {
  login: (formData: FormData) => Promise<ApiResponse<null>>
}

export const LoginForm = ({ login }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const response = await login(formData)

    if (response.status === 401) {
      alert('The email address or password is incorrect.')
    } else if (response.status === 500) {
      alert('Something went wrong. Please try again later.')
    } else {
      router.push('/')
    }
    
    setIsSubmitting(false)
  }
  return (
    <form method="POST" onSubmit={handleLogin} className="flex flex-col gap-8">
      <Field>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" placeholder=' ' className="peer" autoComplete='email' required />
        <p className="hidden text-destructive text-sm peer-placeholder-shown:hidden peer-[:not(:placeholder-shown):invalid]:block">
          Please enter a vailid email address.
        </p>
      </Field>
      <Field>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" autoComplete='current-password' required />
      </Field>
      {isSubmitting
          ? <Button className="mt-4" disabled>...</Button>
          : <Button type="submit" className="mt-4 cursor-pointer">Login</Button>}
    </form>
  )
}

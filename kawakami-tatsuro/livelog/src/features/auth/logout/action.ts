'use server'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logout = async () => {
  // cookieを削除するだけなのでtry-catchはしない
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  redirect('/login')
}

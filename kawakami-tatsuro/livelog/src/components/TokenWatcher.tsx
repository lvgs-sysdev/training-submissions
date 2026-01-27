'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  isUserLoggedIn: boolean;
}

export const TokenWatcher = ({ isUserLoggedIn }: Props) => {
  const router = useRouter()
  useEffect(() => {
    // ログイン済みになっているのに、Cookieからトークンが消えている場合
    if (isUserLoggedIn && !document.cookie.includes('access_token')) {
      // サーバーに最新の情報を取りに行かせる（Headerが未ログイン状態に切り替わる）
      router.refresh()
    }
  }, [isUserLoggedIn, router])
  
  return null
}

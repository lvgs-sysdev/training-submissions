import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dateオブジェクトをtype="date"のinput用のYYYY-MM--DD形式に変換する
export const formatDateForInput = (date: Date | string | undefined | null): string => {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date

  return d.toLocaleString('sv-SE').slice(0, 10) // sv-SEロケールを選択することでYYYY-MM-DD形式に変換することができる
}

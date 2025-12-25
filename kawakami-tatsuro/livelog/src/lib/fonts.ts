import { Noto_Sans_JP } from 'next/font/google'
import { Zalando_Sans_Expanded } from 'next/font/google'

export const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-noto-sans-jp',
  display: 'swap',
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif']
})

export const zalandSansExpanded = Zalando_Sans_Expanded({
  subsets: ['latin'],
  weight: ['700'],
  preload: false,
  variable: '--font-zaland-sans-expanded',
  display: 'swap',
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif']
})

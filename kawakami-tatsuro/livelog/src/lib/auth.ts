import { cookies } from 'next/headers'
import { createHmac } from 'node:crypto'

// Headerは固定なので、エンコード済みの文字列を定数化
const ENCODED_HEADER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

// JWTの署名に用いる秘密鍵
const secret = process.env.JWT_SECRET
if (!secret) throw new Error('JWT_SECRET is not defined.')

// JWTの有効期間（10時間）
const JWT_EXPIRATION_TIME = 36000

const encodeToBase64Url = (input: string | Buffer): string => {
  const result = Buffer.from(input).toString('base64url')

  return result
}

const createSignature = (data: string, secret: string): string => {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

const createPayload = (user: {id: number, user_name: string}): Record<string, string | number> => {
  const iat = Math.floor(Date.now() / 1000)
  return {
    id: user.id,
    user_name: user.user_name,
    iat: iat,
    exp: iat + JWT_EXPIRATION_TIME,
  }
}

const generateToken = (payload: Record<string, string | number>): string => {
  const encodedPayload = encodeToBase64Url(JSON.stringify(payload))
  const dataToSign = `${ENCODED_HEADER}.${encodedPayload}`

  const signature = createSignature(dataToSign, secret)
  const token = `${ENCODED_HEADER}.${encodedPayload}.${signature}`

  return token
}

export const setAuthCookie = async (user: {id: number, user_name: string}) => {
  const payload = createPayload(user)
  const token = generateToken(payload)

  const cookieStore = await cookies()
  cookieStore.set('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 本番環境のみtrue
    sameSite: 'lax',
    maxAge: JWT_EXPIRATION_TIME,
  })
}

const isExpiredToken = (exp: number): boolean => {
  return exp < Date.now() / 1000
}

export const getVerifiedUser = async ():Promise<{id: number, userName: string} | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null
  
  const splitAccessToken = accessToken.value.split('.')
  if (splitAccessToken.length !== 3) return null // JWTが2つのドットを含まない文字列に改ざんされていた場合
  const [header, payload, signature] = splitAccessToken

  const reCalculatedSignature = createSignature(`${header}.${payload}`, secret)
  if (reCalculatedSignature !== signature) return null // JWTの署名が改ざんされていた場合

  try {
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {id: number, user_name: string, iat: number, exp: number}

  if (isExpiredToken(decodedPayload.exp)) return null

  return { id: decodedPayload.id, userName: decodedPayload.user_name }
  } catch (error) {
    return null
  }
}

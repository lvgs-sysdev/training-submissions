import { getVerifiedUser } from "@/lib/auth"
import pool from "@/lib/db"
import { FieldPacket, ResultSetHeader } from "mysql2";
import { updateAccountInfo } from "./actions";
import { MySqlError } from "../../types";

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

vi.mock('@/lib/auth', () => ({
  getVerifiedUser: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('updateAccountInfo関数のテストコード', () => {
  let testNewAccountInfo: FormData

  beforeEach(() => {
    testNewAccountInfo = new FormData()
    testNewAccountInfo.append('userName', 'Test 1')
    testNewAccountInfo.append('email', 'test@test.com')
  })

  test('有効なユーザー名とメールアドレスを渡し、DBの更新に成功した場合、成功レスポンス（200）を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })

    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 1 // DBを更新できた場合の戻り値
    } as ResultSetHeader, [] as FieldPacket[]])

    const result = await updateAccountInfo(testNewAccountInfo)
    
    expect(result).toEqual({
      success: true,
      status: 200,
      data: null
    })
  })

  test('トークンが切れていた場合に401 (Unauthorized)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue(null)

    const result = await updateAccountInfo(testNewAccountInfo)
    
    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 401,
      code: 'UNAUTHORIZED'
    }))
  })

  test('アカウントが存在しない場合に404 (Not Found)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })

    vi.mocked(pool.query).mockResolvedValue([{
      affectedRows: 0 // アカウントが見つからなかった場合の戻り値
    } as ResultSetHeader, [] as FieldPacket[]])

    const result = await updateAccountInfo(testNewAccountInfo)
    
    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 404,
      code: 'NOT_FOUND'
    }))
  })

  test('変更しようとしたメールアドレスが既に使用されていた場合に409 (Conflict)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })

    const conflictError: MySqlError = {
      name: '',
      message: '',
      code: 'ER_DUP_ENTRY'
    }

    vi.mocked(pool.query).mockRejectedValue(conflictError)

    const result = await updateAccountInfo(testNewAccountInfo)
    
    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 409,
      code: 'EMAIL_DUPLICATE'
    }))
  })

  test('DBで上記以外のエラーが発生した場合に500 (Internal Server Error)を返すこと', async () => {
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: 1,
      userName: 'Test'
    })

    vi.mocked(pool.query).mockRejectedValue(new Error('Connection timeout'))

    const result = await updateAccountInfo(testNewAccountInfo)
    
    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 500
    }))
  })
})

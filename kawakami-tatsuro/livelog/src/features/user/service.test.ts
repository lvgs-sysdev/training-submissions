import pool from "@/lib/db"
import { FieldPacket, RowDataPacket } from "mysql2"
import { fetchUserById } from "./service"

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

describe('fetchUserById関数のテストコード', () => {
  test('存在するユーザーIDを渡した場合、該当するユーザーの情報を返すこと', async () => {
    const userId = '1'
    const testData = {
      id: 1,
      user_name: 'Test User',
      pic_path: '/test.jpg',
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-01')
    }

    vi.mocked(pool.query).mockResolvedValue([[testData] as RowDataPacket[], [] as FieldPacket[]])

    const result = await fetchUserById(userId)

    expect(pool.query).toHaveBeenCalledWith(
      expect.anything(), // SQL文は検証しない
      expect.objectContaining({ userId: userId }) // 引数で渡したユーザーIDが適切にクエリに渡っているか
    )
    expect(result).toEqual(testData)
  })

  test('存在しないユーザーIDを受け取った場合、undefinedを返すこと', async () => {
    const userId = '-1'

    vi.mocked(pool.query).mockResolvedValue([[] as RowDataPacket[], [] as FieldPacket[]])

    const result = await fetchUserById(userId)

    expect(result).toEqual(undefined)
  })

  test('DBでエラーが発生した場合、エラーをthrowすること', async () => {
    vi.mocked(pool.query).mockRejectedValue(new Error('DB Error'))

    await expect(fetchUserById('1')).rejects.toThrow(Error)
  })
})

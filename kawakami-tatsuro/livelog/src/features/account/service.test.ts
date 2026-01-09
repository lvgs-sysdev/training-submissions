import pool from "@/lib/db"
import { fetchAccountInfo } from "./service"
import { FieldPacket, RowDataPacket } from "mysql2"

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

describe('fetchAccountInfo関数のテスト', () => {
  test('存在するユーザーIDを受け取ったら、そのユーザーの情報を返却すること', async () => {
    const userId = 1
    const testData = {
      id: 1,
      user_name: 'Test User',
      email: 'test@test.com',
      pic_path: '/test.jpg',
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-01')
    }
    vi.mocked(pool.query).mockResolvedValue([[testData] as RowDataPacket[], [] as FieldPacket[]])

    const result = await fetchAccountInfo(userId)

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining(':userId'), // SQLの中身にプレースホルダーが含まれているか
      expect.objectContaining({ userId: userId }) // 引数で渡したユーザーIDが適切にクエリに渡っているか
    )
    expect(result).toEqual(testData)
  })

  test('存在しないユーザーIDを受け取ったら、undefinedを返却すること', async () => {
    const userId = -1

    vi.mocked(pool.query).mockResolvedValue([[] as RowDataPacket[], [] as FieldPacket[]])

    const result = await fetchAccountInfo(userId)

    expect(result).toEqual(undefined)
  })

  test('DBでエラーが発生した際、エラーをthrowすること', async () => {
    vi.mocked(pool.query).mockRejectedValue(new Error('DB Error'))

    await expect(fetchAccountInfo(1)).rejects.toThrow(Error)
  })
})

import pool from "@/lib/db"
import { FieldPacket, RowDataPacket } from "mysql2"
import { searchArtistsOfPosts } from "./service"

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

describe('searchArtistsOfPosts関数のテストコード', () => {
  test('受け取った値でDBを検索して該当したアーティストの情報を返却すること', async () => {
    const input = 'test'
    const testData = [{
      id: 1,
      spotify_id: 'test',
      artist_name: 'test',
      created_at: new Date('2026-01-01') 
    }]

    vi.mocked(pool.query).mockResolvedValue([testData as RowDataPacket[], [] as FieldPacket[]])

    const result = await searchArtistsOfPosts(input)

    expect(pool.query).toHaveBeenCalledWith(
      expect.anything(), // SQL文は検証しない
      expect.objectContaining({ searchPattern: `%${input}%` }) // 引数で渡した入力値が適切にクエリに渡っているか
    )
    expect(result).toEqual(testData)
  })

  test('DBでエラーが発生した場合、エラーをthrowすること', async () => {
    vi.mocked(pool.query).mockRejectedValue(new Error('DB Error'))

    await expect(searchArtistsOfPosts('test')).rejects.toThrow(Error)
  })
})

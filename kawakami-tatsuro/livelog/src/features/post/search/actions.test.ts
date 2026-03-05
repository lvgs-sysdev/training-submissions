import { getArtistsFromInput } from './actions'
import * as service from './service'

vi.mock('./service')

describe('getArtistsFromInput関数のテストコード', () => {
  test('渡された入力値でのアーティストのデータの取得に成功した場合、Status 200とデータを返すこと', async () => {
    const mockArtists = [{
      id: 1,
      spotify_id: 'test',
      artist_name: 'test',
      created_at: new Date('2026-01-01')
    }]

    vi.mocked(service.searchArtistsOfPosts).mockResolvedValue(mockArtists)

    const result = await getArtistsFromInput('test')

    expect(result).toEqual({
      success: true,
      status: 200,
      data: mockArtists
    })
  })

  test('エラーが発生した場合、Status 500を返すこと', async () => {
    vi.mocked(service.searchArtistsOfPosts).mockRejectedValue(new Error('DB Error'))

    const result = await getArtistsFromInput('test')

    expect(result).toEqual(expect.objectContaining({
      success: false,
      status: 500,
      code: 'INTERNAL_ERROR'
    }))
  })
})
